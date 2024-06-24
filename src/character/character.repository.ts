import { Repository } from "../shared/repository.js";
import { Character } from "./character.entity.js";

const characters = [
  new Character(
    'Darth Vader',
    'Sith',
    11,
    101,
    21,
    11,
    ['Ligthsaber', 'Death start'],
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class CharacterRepository implements Repository<Character>{
  public findAll(): Character[] | undefined {
    return characters;
  }

  public findOne(item: { id: string; }): Character | undefined {
    return characters.find((character)=> character.id === item.id)
  }

  public add(item: Character): Character | undefined {
    characters.push(item);
    return item;
  }

  public update(item: Character): Character | undefined {
    const characterIdx= characters.findIndex(character => character.id === item.id);
    if(characterIdx !== -1 ){
      characters[characterIdx]= {...characters[characterIdx], ...item};    
    }
    return characters[characterIdx];
  }

  public delete(item: { id: string; }): Character | undefined {
    const characterIdx= characters.findIndex(character => character.id === item.id);
    if(characterIdx !== -1){
      const deleteCharacter= characters.splice(characterIdx,1);
      return deleteCharacter[0];
    };   
  }
}