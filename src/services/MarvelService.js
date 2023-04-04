
class MarvelService{
_apiBase = "https://gateway.marvel.com:443/v1/public/";
_apiKey = "apikey=3bac39e3b19a1f43d3b5469e03e68510";

_baseOffset = Math.floor(Math.random() * (220 - 250) + 220);

    getResource = async (url) =>{
        let res = await fetch(url);

        if(!res.ok){
            throw new Error (`Нет связи с сервером ${url}, status ${res.status}`);
        }
        return await res.json();
    }
getAllCharacters = async (offset = this._baseOffset) =>{
    
    const res = await this.getResource(`${this._apiBase}characters?limit=4&offset=${offset}&${this._apiKey}`)
    
   return res.data.results.map(this._transformCharacter);//трансформируем получаемый массив, где каждый объект по порядку, 
   //сформируется массив с объектами
}

getCharacter = async (id) =>{
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
    return this._transformCharacter(res.data.results[0]);//возврат трансформированного результата
}

//метод обработки данных(res) из getCharacter
_transformCharacter = (char) =>{
    return{
        id: char.id,
        name: char.name,
        description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
        thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
        homepage: char.urls[0].url,
        wiki: char.urls[1].url,
        comics: char.comics.items.slice(0, 10)
    }
}
}
export default MarvelService;


