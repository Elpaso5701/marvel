import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import { Component } from "react";
import decoration from '../../resources/img/vision.png';
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";


class App extends Component{
state = {
        selectedChar: null,
        showRandomChar: true
    } 
 onCharSelected = (id) =>{
    this.setState({
        selectedChar: id
    })
 }


    toggleRandomChar = () => {
        this.setState((state) => {
            return {showRandomChar: !state.showRandomChar}
        })
    }
    render(){
        return (
            <div className="app">
                <AppHeader />
                <main>
                    {this.state.showRandomChar ? <RandomChar /> : null}
                    <button onClick={this.toggleRandomChar}>Click</button>

                    <div className="char__content">
                    <ErrorBoundary>
                        <CharList onCharSelect = {this.onCharSelected} />
                    </ErrorBoundary>    
                        <ErrorBoundary>
                        <CharInfo charId = {this.state.selectedChar}/>

                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision" />
                </main>
            </div>
        )
    }
}


export default App;