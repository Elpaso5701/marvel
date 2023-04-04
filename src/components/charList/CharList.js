import {Component} from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';
import PropTypes from 'prop-types';


class CharList extends Component {


    state = {
        charList: [],
        loading: true,
        error: false,
        AdditionalCharLoading: false,
        offset: 1554,
        EndOffset: false
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest()
     
    }
  
    onRequest = (offset) =>{
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

   onCharListLoading = () => {
    this.setState ({
        AdditionalCharLoading: true
    })
   } 

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 4){
            ended = true;
        }

        this.setState(({offset, charList}) => ({//массив в текущем стейте, в который добавим еще персонажей
            charList: [...charList, ...newCharList],
            loading: false,
            AdditionalCharLoading: false, //после загрузки персонажей свойство перключаем в false
            offset: offset + 4, //текущий стейт + 3// после первичной отрисовки в offset будет рандомное число
            EndOffset: ended
    }))
        // console.log(charList)
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items = arr.map((item, i) => {
            // let imgStyle = {'objectFit' : 'cover'};
            // if (item.thumbnail.includes ('image_not_available')) {
            //     imgStyle = {'objectFit' : 'unset'};
            // }
            let imgStyle;
            item.thumbnail.includes ('image_not_available') ? imgStyle = {'objectFit' : 'unset'} : imgStyle = {'objectFit' : 'cover'}
            

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick ={()=>{
                    this.props.onCharSelect(item.id);
                    this.focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                this.props.onCharSelected(item.id);
                                this.focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, offset, AdditionalCharLoading, EndOffset} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null; 

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                 disabled = {AdditionalCharLoading} 
                 style = {{"display": EndOffset ? "none" : 'block'}}
                 onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;




















// let ladder = {
//     step: 0,
//     up() {
//       this.step++;
//      return this
//     },
//     down() {
//       this.step--;
//       return this
//     },
//     showStep(){ // показывает текущую ступеньку
//       console.log( this.step );
//       return this
//     }
//   };

//   ladder.up();
//   ladder.up();
//   ladder.down();
//   ladder.showStep(); // 1
//   ladder.down();
//   ladder.showStep(); // 0

//   ladder
//   .up()
//   .up()
//   .down()
//   .showStep() // 1
//   .down()
//   .showStep(); // 0



