import * as THREE from './js/three.module.js'

export let character = null

const characterGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
const characterMaterial = new THREE.MeshPhongMaterial({ color: 'gold' })
character = new THREE.Mesh(characterGeometry, characterMaterial)
character.castShadow = true
character.receiveShadow = true
character.name = 'player'
character.position.set(1, 1, 1)
