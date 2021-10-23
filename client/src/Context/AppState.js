import React from 'react'
import AppContext from "./AppContext";

function AppState(props) {

    return (
        <AppContext.Provider value={{ message: "Message from app state" }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppState
