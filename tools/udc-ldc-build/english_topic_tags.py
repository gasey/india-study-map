"""Classify only English question types made explicit by their source text."""
import re


def classify_english_topic(direction='', question='', topic_label=''):
    text = ' '.join(str(value or '') for value in (direction, question, topic_label)).lower()

    # Check the explicit antonym wording before broader vocabulary cues.
    if re.search(r'\b(antonym|opposite in meaning|opposite meaning|opposite of|opposite to)\b', text):
        return 'vocabulary_antonym'
    if re.search(r'\b(synonym|synonymous|similar meaning|nearest in meaning|nearest meaning|closest in meaning|word nearest in meaning)\b', text):
        return 'vocabulary_synonym'
    if (re.search(r'\b(idiom|idioms|idiomatic)\b', text)
            or re.search(r'\bphrase(?:s)?\s+(?:means?|meaning|written|given)\b', text)
            or re.search(r'\bmeaning of (?:the )?phrase\b', text)):
        return 'idioms_phrases'
    return None


TOPIC_LABELS = {
    'idioms_phrases': 'Idioms & Phrases',
    'vocabulary_synonym': 'Synonyms',
    'vocabulary_antonym': 'Antonyms',
}
