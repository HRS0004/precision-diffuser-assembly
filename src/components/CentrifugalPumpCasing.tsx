import { useMemo } from 'react';
import * as THREE from 'three';

interface CentrifugalPumpCasingProps {
  scale?: number;
}

export const CentrifugalPumpCasing = ({ scale = 0.01 }: CentrifugalPumpCasingProps) => {
  const { mainBody, suctionFlange, dischargeFlange, mountingFeet, voluteCutaway } = useMemo(() => {
    const parts: { [key: string]: THREE.BufferGeometry[] } = {
      mainBody: [],
      suctionFlange: [],
      dischargeFlange: [],
      mountingFeet: [],
      voluteCutaway: []
    };

    // Main volute body - simplified spiral casing
    const voluteProfile = new THREE.Shape();
    const spiralSegments = 64;
    const voluteBaseRadius = 103; // R103 mm
    const throatWidth = 36;
    const voluteHeight = 112;
    
    // Create volute spiral path
    for (let i = 0; i <= spiralSegments; i++) {
      const angle = (i / spiralSegments) * Math.PI * 1.5; // 270 degrees
      const radiusExpansion = 1 + (i / spiralSegments) * 0.4; // Expanding spiral
      const radius = voluteBaseRadius * radiusExpansion;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        voluteProfile.moveTo(x, y);
      } else {
        voluteProfile.lineTo(x, y);
      }
    }
    
    // Close the volute shape to form casing
    const cutoffAngle = Math.PI * 0.2;
    voluteProfile.lineTo(
      Math.cos(cutoffAngle) * voluteBaseRadius,
      Math.sin(cutoffAngle) * voluteBaseRadius
    );
    voluteProfile.lineTo(0, 0);
    voluteProfile.closePath();
    
    // Extrude volute casing
    const voluteGeometry = new THREE.ExtrudeGeometry(voluteProfile, {
      depth: voluteHeight,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 3,
      bevelSegments: 2
    });
    voluteGeometry.rotateX(Math.PI / 2);
    voluteGeometry.translate(0, voluteHeight / 2, 0);
    parts.mainBody.push(voluteGeometry);

    // Create suction flange (DN 32, Ø125 bolt circle)
    const suctionFlangeGeometry = new THREE.CylinderGeometry(
      125 / 2, // Bolt circle radius
      125 / 2,
      15, // Flange thickness
      32
    );
    suctionFlangeGeometry.rotateX(Math.PI / 2);
    suctionFlangeGeometry.translate(-140, voluteHeight / 2, 0); // 140mm extension
    parts.suctionFlange.push(suctionFlangeGeometry);
    
    // Suction nozzle
    const suctionNozzleGeometry = new THREE.CylinderGeometry(
      40, // DN 32 bore
      40,
      140, // Extension length
      24
    );
    suctionNozzleGeometry.rotateX(Math.PI / 2);
    suctionNozzleGeometry.translate(-70, voluteHeight / 2, 0);
    parts.suctionFlange.push(suctionNozzleGeometry);
    
    // Add bolt holes to suction flange (4 × Ø19)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const boltX = Math.cos(angle) * (125 / 2);
      const boltZ = Math.sin(angle) * (125 / 2);
      
      const boltHoleGeometry = new THREE.CylinderGeometry(
        9.5, 9.5, 20, 12
      );
      boltHoleGeometry.rotateX(Math.PI / 2);
      boltHoleGeometry.translate(-140 + boltX, voluteHeight / 2, boltZ);
    }

    // Create discharge flange (DN 50, Ø140 bolt circle)
    const dischargeFlangeGeometry = new THREE.CylinderGeometry(
      140 / 2,
      140 / 2,
      15,
      32
    );
    const dischargeAngle = Math.PI * 1.3; // Position on volute spiral
    const dischargeX = Math.cos(dischargeAngle) * voluteBaseRadius * 1.3;
    const dischargeZ = Math.sin(dischargeAngle) * voluteBaseRadius * 1.3;
    
    dischargeFlangeGeometry.rotateZ(Math.PI / 2);
    dischargeFlangeGeometry.translate(dischargeX, 75, dischargeZ); // 75mm above base
    parts.dischargeFlange.push(dischargeFlangeGeometry);
    
    // Discharge nozzle
    const dischargeNozzleGeometry = new THREE.CylinderGeometry(
      37.5, // Ø75 opening
      37.5,
      80,
      24
    );
    dischargeNozzleGeometry.rotateZ(Math.PI / 2);
    dischargeNozzleGeometry.translate(dischargeX - 40, 75, dischargeZ);
    parts.dischargeFlange.push(dischargeNozzleGeometry);

    // Create mounting feet
    const footWidth = 40;
    const footLength = 60;
    const footHeight = 20;
    const footSpacing = 165; // n165 mm spacing
    
    for (let i = 0; i < 2; i++) {
      const footGeometry = new THREE.BoxGeometry(footLength, footHeight, footWidth);
      const footX = (i === 0 ? -footSpacing / 2 : footSpacing / 2);
      footGeometry.translate(footX, footHeight / 2 - 10, 0);
      parts.mountingFeet.push(footGeometry);
      
      // Mounting hole (Ø18)
      const holeGeometry = new THREE.CylinderGeometry(9, 9, footHeight + 5, 16);
      holeGeometry.translate(footX, footHeight / 2 - 10, 0);
    }

    // Internal volute cutaway visualization
    const cutawayGeometry = new THREE.TorusGeometry(
      voluteBaseRadius * 0.8,
      throatWidth / 2,
      16,
      64,
      Math.PI * 1.5
    );
    cutawayGeometry.rotateX(Math.PI / 2);
    cutawayGeometry.translate(0, voluteHeight / 2, 0);
    parts.voluteCutaway.push(cutawayGeometry);

    return {
      mainBody: parts.mainBody,
      suctionFlange: parts.suctionFlange,
      dischargeFlange: parts.dischargeFlange,
      mountingFeet: parts.mountingFeet,
      voluteCutaway: parts.voluteCutaway
    };
  }, []);

  return (
    <group scale={[scale, scale, scale]}>
      {/* Main volute casing body */}
      {mainBody.map((geometry, index) => (
        <mesh key={`body-${index}`} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#4a7c9e"
            metalness={0.6}
            roughness={0.4}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}

      {/* Suction flange and nozzle */}
      {suctionFlange.map((geometry, index) => (
        <mesh key={`suction-${index}`} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#5a8cb0"
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}

      {/* Discharge flange and nozzle */}
      {dischargeFlange.map((geometry, index) => (
        <mesh key={`discharge-${index}`} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#5a8cb0"
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}

      {/* Mounting feet */}
      {mountingFeet.map((geometry, index) => (
        <mesh key={`foot-${index}`} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#3a6c8e"
            metalness={0.5}
            roughness={0.5}
            envMapIntensity={1.0}
          />
        </mesh>
      ))}

      {/* Internal volute visualization (cutaway) */}
      {voluteCutaway.map((geometry, index) => (
        <mesh key={`cutaway-${index}`} geometry={geometry}>
          <meshStandardMaterial
            color="#7ab8d8"
            metalness={0.3}
            roughness={0.6}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};
