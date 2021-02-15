import {useReducer, useCallback} from 'react'

const httpReducer = (prevhttpState, action) => {
    switch(action.type){
      case "SEND":
        return {loading: true, error: null, data: null}
      case 'RESPONSE':
        return {...prevhttpState, loading: false, data: action.responseData}
      case 'ERROR':
        return {loading: false, error: action.error}
      case 'CLEAR':
        return {...prevhttpState, error: null}
      default:
        throw new Error('should not be reached')
    }
  }

const useHttp= () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, 
    {loading: false, error: null, data: null})

    const sendRequest = useCallback((url, method, body) => {
        dispatchHttp({type: 'SEND'})
        fetch(url, {
        method,
        body,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    .then(res => res.json())
    .then(responseData => {
        dispatchHttp({type: 'RESPONSE', responseData})
    })
    .catch(err => dispatchHttp({type: 'ERROR', error: 'something went wrong'}))
    }, [])
    return {
        isLoading: httpState.loading, 
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest
    }
}

export default useHttp