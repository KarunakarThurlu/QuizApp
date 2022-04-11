import React, { useReducer, useState } from 'react'
import TopicsContext from "./TopicContext";
import TopicReducer from './TopicReducer';
import TopicApiCall from "../../ApiCalls/TopicApiCall";
import TopicActions from "./TopicActions";
import Notifier from '../../Utils/Notifier';
import Spinner from "../../Utils/Spinner";



const TopicsState = (props) => {
    const initialState = {
        Topics: [],
        totalCount: 0,
    }
    const [state, dispatch] = useReducer(TopicReducer, initialState);
    const [spinner, setSpinner] = useState(false);

    const saveTopic = async (data) => {
        setSpinner(true);
        await TopicApiCall.addTopic(data)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify("Topic Saved Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: TopicActions.SAVE_TOPIC,
                        payload: response.data.data
                    });
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            }).catch(error => {
                setSpinner(false);
                console.log(error);
            }).finally(() => {
                setSpinner(false);
            });

    }

    const getTopic = async (id) => {
        setSpinner(true);
        await TopicApiCall.getTopicById(id)
            .then(response => {
                setSpinner(false);
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
                setSpinner(false);
                console.log(error);
            }).finally(() => {
                setSpinner(false);
            });
    }
    const deleteTopic = async (id) => {
        setSpinner(true);
        await TopicApiCall.deleteTopic(id)
            .then(response => {
                setSpinner(false);
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
                setSpinner(false);
                console.log(error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const getAllTopics = async (pageNumber, pageSize) => {
        setSpinner(true);
        await TopicApiCall.getAllTopics(pageNumber, pageSize)
            .then(response => {
                setSpinner(false);
                dispatch({
                    type: TopicActions.GET_ALL_TOPICS,
                    payload: response.data
                })
            })
            .catch(error => {
                setSpinner(false);
                console.log(error);
            }).finally(() => {
                setSpinner(false);
            });
    }
    const getTopicNames = async () => {
        setSpinner(true);
        const topics =  localStorage.getItem("topicNames");
        if(topics){
            setSpinner(false);
            dispatch({
                type: TopicActions.TOPIC_NAMES,
                payload: topics
            })
        }else{
        await TopicApiCall.getAllTopicsWithoutpagination()
            .then(response => {
                setSpinner(false);
                localStorage.setItem("topicNames", JSON.stringify(response.data.data));
                dispatch({
                    type: TopicActions.TOPIC_NAMES,
                    payload: response.data.data
                })
            })
            .catch(error => {
                setSpinner(false);
                console.log(error);
            }).finally(() => {
                setSpinner(false);
            });
        }
    }

    const updateTopic = async (data) => {
        setSpinner(true);
        await TopicApiCall.updateTopic(data)
            .then(response => {
                setSpinner(false);
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
                setSpinner(false);
                console.log(error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    return (
        <>
            {spinner && <Spinner open={spinner} />}
            <TopicsContext.Provider value={{
                Topics: state,
                saveTopic,
                getTopic,
                deleteTopic,
                getAllTopics,
                updateTopic,
                getTopicNames
            }}>
                {props.children}
            </TopicsContext.Provider >
        </>
    )
}

export default TopicsState;
