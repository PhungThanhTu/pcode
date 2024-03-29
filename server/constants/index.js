const documentTypes = {
    pdf: 1,
    markdown: 0
}

const defaultExerciseConfiguration = {
    DEFAULT_RUNTIME_LIMIT: 2000,
    DEFAULT_MEMORY_LIMIT: 10000,
    DEFAULT_SCORE_WEIGHT: 1,
    DEFAULT_MANUAL_PERCENTAGE: 0
}

const defaultTestcaseConfiguration = {
    DEFAULT_INPUT: '',
    DEFAULT_OUTPUT: '',
    DEFAULT_SCORE_WEIGHT: 1,
    DEFAULT_VISIBILITY: true
}


module.exports = {
    documentTypes,
    defaultExerciseConfiguration,
    defaultTestcaseConfiguration
}