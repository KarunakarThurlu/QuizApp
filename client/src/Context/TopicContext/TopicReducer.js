import TopicActions from "./TopicActions";

const TopicsReducer = (state, action) => {
    switch (action.type) {
        case TopicActions.SAVE_TOPIC:
            return {
                ...state,
                Topics: [...state.Topics, action.payload]
            }
        case TopicActions.UPDATE_TOPIC:
            let updatedList= state.Topics.map((item) =>item._id===action.payload._id?action.payload:item)
            return {
                ...state,
                Topics: updatedList
            }
        case TopicActions.DELETE_TOPIC:
            return {
                ...state,
                Topics: state.Topics.filter(topic => topic._id !== action.payload)
            }
        case TopicActions.GET_TOPIC: {
            return {
                ...state,
                Topics: state.Topics.filter(topic => topic._id === action.payload)
            }
        }
        case TopicActions.GET_ALL_TOPICS: {
            return {
                ...state,
                Topics: action.payload.data,
                totalCount: action.payload.totalCount
            }
        }
        default:
            return state;

    }
}

export default TopicsReducer;