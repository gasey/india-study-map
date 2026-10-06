"""Extract the original PPTX text, in presentation order, without third-party packages.

Usage: python3 tools/history-build/extract.py --source-dir /path/to/presentations
Generated output is separate from curated curriculum/questions; rebuilding cannot erase edits.
"""
import argparse
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile
from posixpath import normpath

ROOT = Path(__file__).resolve().parents[2]
SOURCES = {
    "ancient": "ANCIENT INDIAN HISTORY-Prelims MS Academy.pptx",
    "sultanate": "Medieval Indian History Prelims-Delhi Sultanate.pptx",
    "mughals": "Medieval Indian History Prelims- Mughals.pptx",
    "modern": "HISTORY Modern India MS Academy.pptx",
    "freedom": "Freedom Struggle-Various Stages.pptx",
    "mains-1": "History Mains I.pptx",
    "mains-2": "History Mains II.pptx",
    "mains-pyq": "History Mains Old Questions-July 2025.pptx",
    "republic": "Post Independence Mains.pptx",
}
NS = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def extract(directory):
    documents = []
    for source_id, filename in SOURCES.items():
        path = directory / filename
        with ZipFile(path) as archive:
            rels = {r.attrib["Id"]: normpath("ppt/" + r.attrib["Target"])
                    for r in ET.fromstring(archive.read("ppt/_rels/presentation.xml.rels"))}
            order = ET.fromstring(archive.read("ppt/presentation.xml")).findall("p:sldIdLst/p:sldId", NS)
            slides = []
            for number, entry in enumerate(order, 1):
                target = rels[entry.attrib["{" + NS["r"] + "}id"]]
                root = ET.fromstring(archive.read(target))
                paragraphs = ["".join(t.text or "" for t in p.findall(".//a:t", NS)).strip()
                              for p in root.findall(".//a:p", NS)]
                paragraphs = [p for p in paragraphs if p]
                pictures = root.findall(".//p:pic", NS)
                images = []
                relpath = str(Path(target).parent / "_rels" / (Path(target).name + ".rels"))
                if pictures and relpath in archive.namelist():
                    image_rels = {r.attrib["Id"]: r.attrib["Target"]
                                  for r in ET.fromstring(archive.read(relpath))
                                  if r.attrib.get("TargetMode") != "External"}
                    for picture in pictures:
                        blip = picture.find(".//a:blip", NS)
                        if blip is None:
                            continue
                        image_target = image_rels.get(blip.attrib.get("{" + NS["r"] + "}embed"))
                        if not image_target:
                            continue
                        media_path = normpath(str(Path(target).parent / image_target)).lstrip("/")
                        if Path(media_path).suffix.lower() not in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}:
                            continue
                        filename_out = f'{source_id}-{Path(media_path).name}'
                        output_image = ROOT / "public/history/media" / filename_out
                        output_image.parent.mkdir(parents=True, exist_ok=True)
                        output_image.write_bytes(archive.read(media_path))
                        images.append("/history/media/" + filename_out)
                slides.append({"number": number, "paragraphs": paragraphs,
                               "imageCount": len(pictures), "images": images})
            documents.append({"id": source_id, "filename": filename,
                              "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                              "slideCount": len(slides), "slides": slides})
    output = ROOT / "public/history/data/sources.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps({"schemaVersion": 1, "documents": documents}, ensure_ascii=False, indent=2) + "\n")
    for document in documents:
        print(f'{document["id"]}: {document["slideCount"]} slides')
    print(f'Total: {sum(d["slideCount"] for d in documents)} slides')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    extract(parser.parse_args().source_dir)
