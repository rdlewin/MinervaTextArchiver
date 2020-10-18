from . import heuristics


def classify_message(message):

    for classifier in heuristics.CLASSIFIERS:
        classifications = classifier.classify(message)
        for classification in classifications:
            if classification.is_new:
                classification.discussion.save()

            message.discussions.add(classification.discussion)
