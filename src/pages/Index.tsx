import { useState, Suspense } from 'react';
import { Scene3D } from '@/components/Scene3D';
import { ViewControls } from '@/components/ViewControls';
import { Loader2 } from 'lucide-react';

type CameraView = 'top' | 'side' | 'isometric';
type ModelType = 'diffuser' | 'casing';

const Index = () => {
  const [view, setView] = useState<CameraView>('isometric');
  const [bladeCount, setBladeCount] = useState(24);
  const [modelType, setModelType] = useState<ModelType>('diffuser');
  const [autoRotate, setAutoRotate] = useState(false);
  const [showCutaway, setShowCutaway] = useState(false);

  return (
    <main className="relative w-screen h-screen bg-viewport overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">
            Diffuser Blade Assembly Viewer
          </h1>
          <p className="text-sm text-muted-foreground">
            CFD-Optimized Multistage Centrifugal Pump Component
          </p>
        </div>
      </header>

      {/* 3D Viewport */}
      <div className="absolute inset-0 pt-[88px]">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-viewport">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading 3D model...
                </p>
              </div>
            </div>
          }
        >
          <Scene3D 
            view={view} 
            bladeCount={bladeCount} 
            modelType={modelType}
            autoRotate={autoRotate}
            showCutaway={showCutaway}
          />
        </Suspense>
      </div>

      {/* Controls */}
      <ViewControls
        view={view}
        onViewChange={setView}
        bladeCount={bladeCount}
        onBladeCountChange={setBladeCount}
        modelType={modelType}
        onModelTypeChange={setModelType}
        autoRotate={autoRotate}
        onAutoRotateChange={setAutoRotate}
        showCutaway={showCutaway}
        onShowCutawayChange={setShowCutaway}
      />

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-10 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-xs">
          <h3 className="text-sm font-semibold mb-2 text-foreground">
            Specifications
          </h3>
          {modelType === 'diffuser' ? (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• Blade Count: {bladeCount}</p>
              <p>• Axial Thickness: 8-12mm</p>
              <p>• Material: Anodized Aluminum</p>
              <p>• Blade Profile: Aerodynamic Airfoil</p>
              <p>• Sweep: Backward-Swept Exit</p>
              <p>• Hub: Streamlined Dome Design</p>
            </div>
          ) : (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• Model: N32-125</p>
              <p>• Suction: DN 32 (Ø125mm)</p>
              <p>• Discharge: DN 50 (Ø140mm)</p>
              <p>• Overall: 319×190mm</p>
              <p>• Wall: 10mm thickness</p>
              <p>• Material: Cast Steel/Iron</p>
            </div>
          )}
      </div>
    </main>
  );
};

export default Index;
