"use client";

import { useState } from 'react';
import AssemblyViewer from '@/components/viewer/AssemblyViewer';
import { getAvailableScenePresets } from '@/lib/scene-presets';

export default function Test3DPage() {
  const scenePresets = getAvailableScenePresets();
  const [currentPreset, setCurrentPreset] = useState(scenePresets[0]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">3D Viewer Test Page</h1>
        <p className="mb-8 text-gray-600">
          Testing React Three Fiber with primitive-based scene presets
        </p>

        {/* Scene selector */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Scene Preset:
          </label>
          <select
            value={currentPreset}
            onChange={(e) => setCurrentPreset(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            {scenePresets.map((preset) => (
              <option key={preset} value={preset}>
                {preset.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* 3D Viewer */}
        <div className="rounded-lg bg-white p-4 shadow">
          <AssemblyViewer scenePreset={currentPreset} />
        </div>

        {/* Info panel */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">Current Scene:</h2>
          <p className="font-mono text-sm text-gray-700">{currentPreset}</p>
          
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-600">Controls:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• <strong>Left Click + Drag:</strong> Rotate camera</li>
              <li>• <strong>Right Click + Drag:</strong> Pan camera</li>
              <li>• <strong>Scroll:</strong> Zoom in/out</li>
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-600">Available Presets:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 md:grid-cols-3">
              {scenePresets.map((preset) => (
                <div key={preset} className="rounded bg-gray-50 px-2 py-1">
                  {preset}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

