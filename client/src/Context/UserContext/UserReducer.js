import UserActions from "./UserActions";

const userReducer = (state, action) => {
    switch (action.type) {
        case UserActions.SAVE_USER:
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        case UserActions.UPDATE_USER:
            let updatedList= state.users.map((item) =>item._id===action.payload._id?action.payload:item)
            return {
                ...state,
                users: updatedList
            }
        case UserActions.DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.payload)
            }
        case UserActions.GET_USER: {
            return {
                ...state,
                users: state.users.filter(user => user._id === action.payload)
            }
        }
        case UserActions.GET_ALL_USERS: {
            return {
                ...state,
                users: action.payload.data || [],
                totalCount: action.payload.totalCount
            }
        }
        case UserActions.ADD_LOGIN_USER_DATA: {
            return {
                ...state,
                loggedInUser: action.payload 
            }
        }
        case UserActions.GET_LOGIN_USER_DATA: {
            return {
                ...state,
                loggedInUser:state.loggedInUser
            }
        }
        default:
            return state;

    }
}

export default userReducer;