import React, { useReducer } from 'react'
import QuestionsContext from "./QuestionsContext";
import QuestionReducer from './QuestionsReducer';
import QuestionApiCall from "../../ApiCalls/QuestionsApiCall";

import QuestionActions from "./QuestionActions";
import Notifier from '../../Utils/Notifier';


const QuestionsState = (props) => {
    const initialState = {
        questions: [],
        totalCount: 0
    }
    const [state, dispatch] = useReducer(QuestionReducer, initialState);

    const saveQuestion = async (data) => {
        await QuestionApiCall.saveQuestion(data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify("Question Saved Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: QuestionActions.SAVE_QUESTION,
                        payload: response.data.data
                    });
                    return response.data.statusCode;
                }else{
                    Notifier.notify( response.data.message, Notifier.notificationType.ERROR);
                }
            }).catch(error => {
                console.log(" While Saving Question ===> ",error);
            })

    }

    const getQuestion = async (id) => {
        await QuestionApiCall.getQuestionById(id)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify("Question Deleted Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: QuestionActions.GET_QUESTION,
                        payload: id
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                }
            })
            .catch(error => {
                console.log("While Getting Question ===> ", error);
            });
    }
    const deleteQuestion = async (id) => {
        await QuestionApiCall.deleteQuestion(id)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                    getAllQuestions();
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                console.log("While Deleting Question ===> ", error);
            });
    }

    const getAllQuestions = async (pageNumber,pageSize) => {
        await QuestionApiCall.getAllQuestions(pageNumber,pageSize)
            .then(response => {
                dispatch({
                    type: QuestionActions.GET_ALL_QUESTIONS,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log("While Getting All Questions ===> ", error);
            })
    }

    const updateQuestion = async (data) => {
        await QuestionApiCall.updateQuestion(data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: QuestionActions.UPDATE_QUESTION,
                        payload: response.data.data
                    })
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                console.log("While Updating Question ===> ", error);
            });
    }

    return (
        <QuestionsContext.Provider value={{
            questions: state,
            saveQuestion,
            getQuestion,
            deleteQuestion,
            getAllQuestions,
            updateQuestion
        }}>
            { props.children}
        </QuestionsContext.Provider >
    )
}

export default QuestionsState;
