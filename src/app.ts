import express, { NextFunction, Request, Response } from "express";
import { Character } from "./character/character.entity.js";
import { CharacterRepository } from "./character/character.repository.js";

const app= express();
app.use(express.json()) //middleware que proporciona express para manejar los metodos post, put y patch

// metodos de http para comunicar el frontend con el backend:
// get --> obtener info sobre recursos
// post --> crear nuevos recursos
// delete --> borrar recursos
// put & patch --> modificar recursos

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

app.get('/api/characters',(req,res)=>{
  res.json({data: repository.findAll()});
})

app.get('/api/characters/:id',(req,res)=>{
  const character= repository.findOne({id: req.params.id});
  if(!character){
    return res.status(404).send({message: 'character not found!'});
  }
  return res.json({data:character});
})

// Metodo put usando Sanitizacion ---> funcion santizeCharacterInput
app.post('/api/characters', santizeCharacterInput, (req,res)=>{
  const {name, characterClass, level, hp, mana, attack, items} = req.body.sanitizedInput
  const characterInput= new Character(name, characterClass, level, hp, mana, attack, items);
  const character= repository.add(characterInput);
  return res.status(201).send({message:'Character created', data:character})
})

// Metodo put usando Sanitizacion ---> funcion santizeCharacterInput
app.put('/api/characters/:id', santizeCharacterInput ,(req,res)=>{
  req.body.sanitizedInput.id= req.params.id
  const character= repository.update(req.body.sanitizedInput);
  
  if(!character){
   return res.status(404).send({message:'Character not found'})
  }

  return res.status(200).send({message:'Character update successfully', data:character});
})

// Metodo patch usando Sanitizacion ---> funcion santizeCharacterInput
app.patch('/api/characters/:id', santizeCharacterInput ,(req,res)=>{
  req.body.sanitizedInput.id= req.params.id
  const character= repository.update(req.body.sanitizedInput);
  
  if(!character){
   return res.status(404).send({message:'Character not found'})
  }

  return res.status(200).send({message:'Character update successfully', data:character});
})

app.delete('/api/characters/:id', (req,res)=>{
  const character= repository.delete({id:req.params.id});
  
  if(!character){
    res.status(404).send({message:'Character not found'})
  }else{
    res.status(200).send({message:'Character deleted successfuly'})
  };
})

app.use((_,res)=>{
  return res.status(404).send({message: 'Resource not found'})
})

app.listen(3000, ()=>{
  console.log('Server running on http://localhost: 3000/')
})
