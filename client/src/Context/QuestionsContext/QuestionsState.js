import React, { useReducer, useState } from 'react'
import QuestionsContext from "./QuestionsContext";
import QuestionReducer from './QuestionsReducer';
import QuestionApiCall from "../../ApiCalls/QuestionsApiCall";
import Spinner from "../../Utils/Spinner";
import QuestionActions from "./QuestionActions";
import Notifier from '../../Utils/Notifier';


const QuestionsState = (props) => {
    const initialState = {
        questions: [],
        totalCount: 0
    }
    const [state, dispatch] = useReducer(QuestionReducer, initialState);
    const [spinner, setSpinner] = useState(false);

    const saveQuestion = async (data) => {
        setSpinner(true);
        await QuestionApiCall.saveQuestion(data)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify("Question Saved Successfully", Notifier.notificationType.SUCCESS);
                    dispatch({
                        type: QuestionActions.SAVE_QUESTION,
                        payload: response.data.data
                    });
                    return response.data.statusCode;
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            }).catch(error => {
                setSpinner(false);
                console.log(" While Saving Question ===> ", error);
            }).finally(() => {
                setSpinner(false);
            });

    }

    const getQuestion = async (id) => {
        setSpinner(true);
        await QuestionApiCall.getQuestionById(id)
            .then(response => {
                setSpinner(false);
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
                setSpinner(false);
                console.log("While Getting Question ===> ", error);
            }).finally(() => {
                setSpinner(false);
            });
    }
    const deleteQuestion = async (id) => {
        setSpinner(true);
        await QuestionApiCall.deleteQuestion(id)
            .then(response => {
                setSpinner(false);
                if (response.data.statusCode === 200) {
                    Notifier.notify(response.data.message, Notifier.notificationType.SUCCESS);
                    getAllQuestions();
                } else {
                    Notifier.notify(response.data.message, Notifier.notificationType.ERROR);
                }
            })
            .catch(error => {
                setSpinner(false);
                console.log("While Deleting Question ===> ", error);
            }).finally(() => {
                setSpinner(false)
            });
    }

    const getAllQuestions = async (pageNumber, pageSize) => {
        setSpinner(true);
        await QuestionApiCall.getAllQuestions(pageNumber, pageSize)
            .then(response => {
                setSpinner(false);
                dispatch({
                    type: QuestionActions.GET_ALL_QUESTIONS,
                    payload: response.data
                })
            })
            .catch(error => {
                setSpinner(false);
                console.log("While Getting All Questions ===> ", error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    const updateQuestion = async (data) => {
        setSpinner(true);
        await QuestionApiCall.updateQuestion(data)
            .then(response => {
                setSpinner(false);
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
                setSpinner(false);
                console.log("While Updating Question ===> ", error);
            }).finally(() => {
                setSpinner(false);
            });
    }

    return (
        <>
            {spinner && <Spinner open={spinner} />}
            <QuestionsContext.Provider value={{
                questions: state,
                saveQuestion,
                getQuestion,
                deleteQuestion,
                getAllQuestions,
                updateQuestion
            }}>
                {props.children}
            </QuestionsContext.Provider >
        </>
    )
}

export default QuestionsState;
