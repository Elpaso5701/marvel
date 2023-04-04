import { Component } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInf) {
        console.log(error, errorInf)
        this.setState({
            error: true
        })
    }

    render(){
        const {error} = this.state
    //если ошибка выводим сообщение
    if(error){
        return <ErrorMessage/>
    }
    //или(если нет ошибки)
    return this.props.children; //то что мы помещаем во внутрь Error Boundary
    }
}

export default ErrorBoundary;