import React, { useReducer } from 'react'
import TopicsContext from "./TopicContext";
import TopicReducer from './TopicReducer';
import TopicApiCall from "../../ApiCalls/TopicApiCall";
import TopicActions from "./TopicActions";
import Notifier from '../../Utils/Notifier';


const TopicsState = (props) => {
    const initialState = {
        Topics: [],
        totalCount: 0,
    }
    const [state, dispatch] = useReducer(TopicReducer, initialState);

    const saveTopic = async (data) => {
        await TopicApiCall.addTopic(data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify("Topic Saved Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: TopicActions.SAVE_TOPIC,
                        payload: response.data.data
                    });
                }else{
                    Notifier.notify( response.data.message, Notifier.notificationType.ERROR);
                }
            }).catch(error => {
                console.log(error);
            })

    }

    const getTopic = async (id) => {
        await TopicApiCall.getTopicById(id)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify("Topic Deleted Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: TopicActions.GET_Topic,
                        payload: id
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    const deleteTopic = async (id) => {
        await TopicApiCall.deleteTopic(id)
            .then(response => {
                if (response.data.statusCode === "200") {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: TopicActions.DELETE_TOPIC,
                        payload: id
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getAllTopics = async (pageNumber,pageSize) => {
        await TopicApiCall.getAllTopics(pageNumber,pageSize)
            .then(response => {
                dispatch({
                    type: TopicActions.GET_ALL_TOPICS,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    const updateTopic = async(data) => {
        await TopicApiCall.updateTopic(data)
            .then(response => { 
                if (response.data.statusCode === 200) {
                    Notifier.notify("Topic Updated Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: TopicActions.UPDATE_TOPIC,
                        payload: response.data.data
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <TopicsContext.Provider value={{
            Topics: state,
            saveTopic,
            getTopic,
            deleteTopic,
            getAllTopics,
            updateTopic
        }}>
            { props.children}
        </TopicsContext.Provider >
    )
}

export default TopicsState;
