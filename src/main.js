import titus from '../titus'
const { Game, entity, math, Text } = titus
// import * as mathjs from 'mathjs'
import { convertUnit } from '../titus/utils/conversion'
// import TestFrameSpriteAnimationScreen from './screens/TestFrameSpriteAnimationScreen'
import GameScreen from './screens/GameScreen'
import KeyControls from '../titus/controls/KeyControls'
import Overlay from './ui/Overlay';

let width = window.innerWidth
let height = window.innerHeight

const game = new Game(600, 400)
const controls = {
  keys: new KeyControls()
}

const overlay = new Overlay(600, 400)
game.setUserInterface(overlay)

const defaults = () => ({
  newGame: true,
  level: 1,
  doors: { '1': true },
  data: {},
  hp: 5,
  score: 0,
  spawn: null
})

let state = defaults()

function startGame(toLevel, spawn) {
  state.level = toLevel
  state.spawn = spawn
  game.setScene(
    new GameScreen(game, controls, state)
  )
}

startGame(1, null)

game.run()