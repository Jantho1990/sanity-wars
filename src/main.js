import titus from '../titus'
const { Game, entity, math, Text } = titus
// import * as mathjs from 'mathjs'
import { convertUnit } from '../titus/utils/conversion'
// import TestFrameSpriteAnimationScreen from './screens/TestFrameSpriteAnimationScreen'
import GameScreen from './screens/GameScreen'
import KeyControls from '../titus/controls/KeyControls'
import Overlay from './ui/Overlay';

let width = window.innerWidth * 2/3
let height = window.innerHeight * 4/5

width = 32 * 15
height = 32 * 10

const game = new Game(width, height)
const controls = {
  keys: new KeyControls()
}

const overlay = new Overlay(width, height)
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