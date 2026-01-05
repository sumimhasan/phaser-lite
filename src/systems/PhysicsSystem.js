import System from '../core/System.js';
import Transform from '../components/Transform.js';
import Rigidbody from '../components/Rigidbody.js';
import Collider from '../components/Collider.js';
import Vector2 from '../utils/Vector2.js';

/**
 * Handles physics simulation and collision resolution
 */
export default class PhysicsSystem extends System {
  constructor(engine) {
    super(engine, [Transform, Rigidbody, Collider]);
    this.gravity = new Vector2(0, 500); // pixels/second^2
    this.eventEmitter = engine.eventEmitter || new (class { emit() {} })();
  }

  update(deltaTime) {
    const entities = this.getEntities();
    
    // Update AABBs first
    for (const entity of entities) {
      entity.getComponent(Collider).updateAABB();
    }
    
    // Physics step
    for (const entity of entities) {
      const transform = entity.getComponent(Transform);
      const rigidbody = entity.getComponent(Rigidbody);
      const collider = entity.getComponent(Collider);
      
      if (rigidbody.isStatic) continue;
      
      // Apply gravity
      if (rigidbody.affectedByGravity) {
        rigidbody.velocity = rigidbody.velocity.add(
          this.gravity.multiply(deltaTime)
        );
      }
      
      // Integrate velocity
      const displacement = rigidbody.velocity.multiply(deltaTime);
      transform.position = transform.position.add(displacement);
      
      // Reset acceleration
      rigidbody.acceleration = Vector2.zero();
      
      // Update AABB after movement
      collider.updateAABB();
    }
    
    // Collision detection & resolution
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];
        
        const colliderA = entityA.getComponent(Collider);
        const colliderB = entityB.getComponent(Collider);
        
        if (colliderA.aabb.collidesWith(colliderB.aabb)) {
          // Trigger collision event
          this.eventEmitter.emit('collision', entityA, entityB);
          
          // Resolve non-trigger collisions
          if (!colliderA.isTrigger && !colliderB.isTrigger) {
            const rbA = entityA.getComponent(Rigidbody);
            const rbB = entityB.getComponent(Rigidbody);
            
            // Only move dynamic objects
            if (!rbA.isStatic && rbB.isStatic) {
              this.resolveCollision(entityA, entityB);
            } else if (rbA.isStatic && !rbB.isStatic) {
              this.resolveCollision(entityB, entityA);
            } else if (!rbA.isStatic && !rbB.isStatic) {
              // Both dynamic - resolve both (simplified)
              this.resolveCollision(entityA, entityB);
              this.resolveCollision(entityB, entityA);
            }
          }
        }
      }
    }
  }
  
  resolveCollision(mover, obstacle) {
    const moverCollider = mover.getComponent(Collider);
    const obstacleCollider = obstacle.getComponent(Collider);
    
    const collisionVector = moverCollider.aabb.getCollisionVector(obstacleCollider.aabb);
    if (collisionVector) {
      const transform = mover.getComponent(Transform);
      transform.position = transform.position.add(collisionVector);
      moverCollider.updateAABB();
      
      // Stop velocity in collision direction
      const rb = mover.getComponent(Rigidbody);
      if (Math.abs(collisionVector.x) > Math.abs(collisionVector.y)) {
        rb.velocity.x = 0;
      } else {
        rb.velocity.y = 0;
        rb.onGround = collisionVector.y > 0;
      }
    }
  }
}