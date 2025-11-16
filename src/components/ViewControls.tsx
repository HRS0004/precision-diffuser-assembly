import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Package } from 'lucide-react';

type CameraView = 'top' | 'side' | 'isometric';
type ModelType = 'diffuser' | 'casing';

interface ViewControlsProps {
  view: CameraView;
  onViewChange: (view: CameraView) => void;
  bladeCount: number;
  onBladeCountChange: (count: number) => void;
  modelType: ModelType;
  onModelTypeChange: (type: ModelType) => void;
  autoRotate: boolean;
  onAutoRotateChange: (rotate: boolean) => void;
  showCutaway: boolean;
  onShowCutawayChange: (show: boolean) => void;
}

export const ViewControls = ({
  view,
  onViewChange,
  bladeCount,
  onBladeCountChange,
  modelType,
  onModelTypeChange,
  autoRotate,
  onAutoRotateChange,
  showCutaway,
  onShowCutawayChange,
}: ViewControlsProps) => {
  return (
    <Card className="absolute top-4 left-4 z-10 p-4 bg-card/95 backdrop-blur-sm border-border shadow-lg">
      <div className="space-y-4">
        {/* Model Selection */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
            <Package className="w-4 h-4" />
            Component
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={modelType === 'diffuser' ? 'default' : 'outline'}
              onClick={() => onModelTypeChange('diffuser')}
              className="text-xs flex-1"
            >
              Diffuser
            </Button>
            <Button
              size="sm"
              variant={modelType === 'casing' ? 'default' : 'outline'}
              onClick={() => onModelTypeChange('casing')}
              className="text-xs flex-1"
            >
              Casing
            </Button>
          </div>
        </div>

        {/* Camera View */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">Camera View</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={view === 'top' ? 'default' : 'outline'}
              onClick={() => onViewChange('top')}
              className="text-xs"
            >
              Top
            </Button>
            <Button
              size="sm"
              variant={view === 'side' ? 'default' : 'outline'}
              onClick={() => onViewChange('side')}
              className="text-xs"
            >
              Side
            </Button>
            <Button
              size="sm"
              variant={view === 'isometric' ? 'default' : 'outline'}
              onClick={() => onViewChange('isometric')}
              className="text-xs"
            >
              Isometric
            </Button>
          </div>
        </div>

        {/* Blade Count Control - Only for Diffuser */}
        {modelType === 'diffuser' && (
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Blade Count: {bladeCount}
            </Label>
            <Slider
              value={[bladeCount]}
              onValueChange={(values) => onBladeCountChange(values[0])}
              min={20}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Animation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-foreground">Auto-Rotate</Label>
            <Switch
              checked={autoRotate}
              onCheckedChange={onAutoRotateChange}
            />
          </div>
          
          {modelType === 'casing' && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">Internal View</Label>
              <Switch
                checked={showCutaway}
                onCheckedChange={onShowCutawayChange}
              />
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <p className="font-medium mb-1">Controls:</p>
          <p>• Left click + drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Right click + drag to pan</p>
        </div>
      </div>
    </Card>
  );
};
