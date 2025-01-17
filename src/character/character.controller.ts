import {Request, Response, NextFunction, response} from "express"
import { CharacterRepository } from "./character.repository.js"
import { Character } from "./character.entity.js"


const repository= new CharacterRepository()

// middleware
function santizeCharacterInput(req: Request, res:Response, next: NextFunction){
  req.body.sanitizedInput = {
    name: req.body.name, 
    characterClass: req.body.characterClass, 
    level: req.body.level,
    hp: req.body.hp, 
    mana:req.body.mana, 
    attack:req.body.attack, 
    items:req.body.items
  }
  // more checks here
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

function findAll(req:Request, res:Response){
  res.json({data: repository.findAll()});
}

function findOne(req:Request, res:Response){
    const character= repository.findOne({id: req.params.id});
    if(!character){
      return res.status(404).send({message: 'character not found!'});
    }
    return res.json({data:character});
  }

function add(req: Request, res: Response ){
  const {name, characterClass, level, hp, mana, attack, items} = req.body.sanitizedInput
  const characterInput= new Character(name, characterClass, level, hp, mana, attack, items);
  const character= repository.add(characterInput);
  return res.status(201).send({message:'Character created', data:character})
}

function update(req: Request, res:Response){
  req.body.sanitizedInput.id= req.params.id
  const character= repository.update(req.body.sanitizedInput);
  
  if(!character){
   return res.status(404).send({message:'Character not found'})
  }

  return res.status(200).send({message:'Character update successfully', data:character});
}

function remove(req: Request, res:Response){
  const character= repository.delete({id:req.params.id});
  
  if(!character){
    res.status(404).send({message:'Character not found'})
  }else{
    res.status(200).send({message:'Character deleted successfuly'})
  };
}

export { santizeCharacterInput, findAll, findOne, add, update, remove }