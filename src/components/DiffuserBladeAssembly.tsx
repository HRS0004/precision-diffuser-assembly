import { useMemo } from 'react';
import * as THREE from 'three';

interface DiffuserBladeAssemblyProps {
  bladeCount?: number;
  hubRadius?: number;
  outerRadius?: number;
  thickness?: number;
}

export const DiffuserBladeAssembly = ({
  bladeCount = 24,
  hubRadius = 0.3,
  outerRadius = 1.5,
  thickness = 0.08,
}: DiffuserBladeAssemblyProps) => {
  const { blades, hub, dome } = useMemo(() => {
    const bladeGeometries: THREE.ExtrudeGeometry[] = [];
    
    // Create twisted blade profile
    const angleStep = (Math.PI * 2) / bladeCount;
    
    for (let i = 0; i < bladeCount; i++) {
      const angle = i * angleStep;
      
      // Create blade shape - airfoil-like curve
      const bladeShape = new THREE.Shape();
      
      // Blade profile (airfoil cross-section)
      const bladeWidth = 0.12;
      const numPoints = 20;
      
      // Leading edge (rounded)
      for (let j = 0; j <= numPoints; j++) {
        const t = j / numPoints;
        const x = hubRadius + t * (outerRadius - hubRadius);
        const yOffset = Math.sin(t * Math.PI) * bladeWidth * 0.5;
        
        if (j === 0) {
          bladeShape.moveTo(x, yOffset);
        } else {
          bladeShape.lineTo(x, yOffset);
        }
      }
      
      // Trailing edge (thin)
      for (let j = numPoints; j >= 0; j--) {
        const t = j / numPoints;
        const x = hubRadius + t * (outerRadius - hubRadius);
        const yOffset = -Math.sin(t * Math.PI) * bladeWidth * 0.5;
        bladeShape.lineTo(x, yOffset);
      }
      
      bladeShape.closePath();
      
      // Extrude with twist
      const extrudeSettings = {
        steps: 12,
        depth: thickness,
        bevelEnabled: true,
        bevelThickness: 0.002,
        bevelSize: 0.002,
        bevelSegments: 2,
      };
      
      const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
      
      // Apply rotation and twist
      bladeGeometry.rotateZ(angle);
      
      // Apply backward sweep by rotating around Y axis with radial gradient
      const positions = bladeGeometry.attributes.position;
      for (let j = 0; j < positions.count; j++) {
        const x = positions.getX(j);
        const y = positions.getY(j);
        const z = positions.getZ(j);
        
        const radius = Math.sqrt(x * x + y * y);
        const radiusNorm = (radius - hubRadius) / (outerRadius - hubRadius);
        
        // Add backward sweep (twist along radius)
        const sweepAngle = radiusNorm * 0.3; // 0.3 radians of sweep
        const cosA = Math.cos(sweepAngle);
        const sinA = Math.sin(sweepAngle);
        
        const newZ = z * cosA - x * sinA;
        const newX = z * sinA + x * cosA;
        
        positions.setXYZ(j, newX, y, newZ);
      }
      
      positions.needsUpdate = true;
      bladeGeometry.computeVertexNormals();
      
      bladeGeometries.push(bladeGeometry);
    }
    
    // Create central hub (cylinder)
    const hubGeometry = new THREE.CylinderGeometry(
      hubRadius,
      hubRadius,
      thickness,
      32
    );
    hubGeometry.rotateX(Math.PI / 2);
    
    // Create dome (streamlined nosecone on back)
    const domeGeometry = new THREE.SphereGeometry(hubRadius * 0.95, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeometry.rotateX(Math.PI);
    domeGeometry.translate(0, 0, -thickness / 2 - hubRadius * 0.3);
    
    return {
      blades: bladeGeometries,
      hub: hubGeometry,
      dome: domeGeometry,
    };
  }, [bladeCount, hubRadius, outerRadius, thickness]);

  return (
    <group>
      {/* Central hub */}
      <mesh geometry={hub} castShadow receiveShadow>
        <meshStandardMaterial
          color="#b8c5d6"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Dome cap */}
      <mesh geometry={dome} castShadow receiveShadow>
        <meshStandardMaterial
          color="#a8b5c6"
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Blades */}
      {blades.map((bladeGeometry, index) => (
        <mesh key={index} geometry={bladeGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#c8d5e6"
            metalness={0.75}
            roughness={0.25}
            envMapIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};
