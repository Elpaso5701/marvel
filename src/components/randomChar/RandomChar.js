import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import Spinner from '../spinner/spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

class RandomChar extends Component {
    
    state = {
        char: {}, //объект с данными характеризирующий персонажа
        loading: true,
        error: false
    }
    marvelService = new MarvelService();// поля классов.. Теперь можно обращаться к методам MarvelSevice!

    componentDidMount(){
        this.UpdateChar();//вызов метода во время создания обЪекта
        // this.timer = setInterval(this.UpdateChar, 4000) //интервал запускается после вызова в componentDidMount       
    
    }
    componentWillUnmount(){
       
        // clearInterval(this.timer)//интервал останавливается в componentWillUnmount  
    }
    //результат обращения к сервису из ф-ии .getCharacter из MarvelService.js записываем в state
    onCharLoaded = (hi) => {
      
        this.setState({
            char: hi,
            loading: false //как только данные загрузятся позиция loading станет false
        })
    }
    onCharLoading = () =>{//метод для показа спинера
        this.setState({
            loading: true
        })
    }

    //Действия при ошибке
    onError = () =>{
     this.setState({
        loading: false,
        error: true
     })
    }

    UpdateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();//метод для показа спинера до подучения данных с сервера
        this.marvelService
            .getCharacter(id) //ф-ия из MarvelService.js
            .then(this.onCharLoaded)//результат обращения к сервису из ф-ии .getCharacter из MarvelService.js
            //ловим 404 ошибку
            .catch(this.onError);
    }


    render() {
        
        const { char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <Part char={char} /> : null;
        
        return (
            <div className="randomchar">
                {spinner}
                {errorMessage}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.UpdateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )

    }
}
const Part = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail.includes('image_not_available.jpg')) {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style = {imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;



