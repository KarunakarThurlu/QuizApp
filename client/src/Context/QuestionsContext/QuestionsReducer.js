import QuestionActions from "./QuestionActions";

const QuestionsReducer = (state, action) => {
    switch (action.type) {
        case QuestionActions.SAVE_QUESTION:
            return {
                ...state,
                questions: [...state.questions, action.payload]
            }
        case QuestionActions.UPDATE_QUESTION:
            return {
                ...state,
                questions: state.questions.map(question => {
                    if (question._id === action.payload._id) {
                        return action.payload
                    }
                    return question
                })
            }
        case QuestionActions.DELETE_QUESTION:
            return {
                ...state,
                questions: state.questions.filter(question => question._id !== action.payload)
            }
        case QuestionActions.GET_QUESTION: {
            return {
                ...state,
                question: state.questions.find(question => question._id === action.payload)
                
            }
        }
        case QuestionActions.GET_ALL_QUESTIONS: {
            return {
                ...state,
                questions: action.payload.data,
                totalCount: action.payload.totalCount
            }
        }
        case QuestionActions.QUESTIONS_COUNT: {
            return {
                ...state,
                totalCount: action.payload
            }
        }
        default:
            return state;

    }
}

export default QuestionsReducer;