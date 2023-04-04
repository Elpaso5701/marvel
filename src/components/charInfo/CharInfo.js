import { Component } from 'react';
import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';



class CharInfo extends Component {
    state = {
        char: null, //объект с данными характеризирующий персонажа
        loading: false,
        error: false

    }
    marvelService = new MarvelService();// поля классов.. Теперь можно обращаться к методам MarvelSevice!

    //на всякий случай
    componentDidMount() {
        this.UpdateChar();//вызов метода во время создания обЪекта

    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) this.UpdateChar();//вызов метода во время создания обЪекта
       
    }

    onCharLoading = () => {//метод для показа спинера
        this.setState({
            loading: true
        })
    }

    //Действия при ошибке
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    //Метод отвечающий за изменение компонента при клике по персонажу в CharList.js
    UpdateChar = () => {
        const { charId } = this.props;
        if (!charId) { //если нету charId, тоесть персонаж из CharList не выбран
            return;
        }
        this.onCharLoading();//метод для показа спинера до получения данных с сервера

        this.marvelService
            .getCharacter(charId) //ф-ия из MarvelService.js
            .then(this.onCharLoaded)//результат обращения к сервису из ф-ии .getCharacter из MarvelService.js
            //ловим 404 ошибку
            .catch(this.onError);
        // this.a.v = 0;
    }


    onCharLoaded = (data) => {

        this.setState({
            char: data,
            loading: false //как только данные загрузятся позиция loading станет false
        })
    }

    render() {
        const { char, loading, error } = this.state;
        const skeleton = char || error || loading ? null : <Skeleton /> //заглушка пока персонаж не выбран
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null; //не загрузка не ошибка и есть персонаж

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}

                {content}
            </div>
        )
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail.includes('image_not_available')) imgStyle = { 'objectFit': 'unset' };
        
    const comicsRender = (length, array) => {
        if (!array.length) return 'no comics'
     
        if (length === 'all') {
          return array.map((item, idx) => {
            return (
              <li key={idx} className='char__comics-item'>
                {item.name}
              </li>
            )
          })
        } else {
          const newArray = []
          for (let i = 0; i < length; i++) {
            newArray.push(
              <li key={i} className='char__comics-item'>
                {array[i].name}
              </li>
            )
          }
          return newArray
        }
      } 
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">

           {comicsRender('all', comics)}
                       
                    
            </ul>
        </>
    )

}
CharInfo.propTypes = {charId: PropTypes.number}

export default CharInfo;

