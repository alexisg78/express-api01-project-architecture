import { Router } from "express";
import { santizeCharacterInput, findAll, findOne, add, update, remove } from "./character.controller.js";

export const characterRouter= Router();

characterRouter.get('/', findAll);
characterRouter.get('/:id', findOne);
characterRouter.post('/', santizeCharacterInput, add);
characterRouter.put('/:id', santizeCharacterInput, update);
characterRouter.patch('/:id', santizeCharacterInput, update);
characterRouter.delete('/:id', santizeCharacterInput, remove);