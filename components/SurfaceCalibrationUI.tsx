/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BoundingBox } from '../types';
import { CheckCircle, X, AlertCircle, Camera } from 'lucide-react';

interface SurfaceCalibrationUIProps {
  isCalibrating: boolean;
  detectedSurface: BoundingBox | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const SurfaceCalibrationUI: React.FC<SurfaceCalibrationUIProps> = ({
  isCalibrating,
  detectedSurface,
  onConfirm,
  onCancel
}) => {
  if (!isCalibrating) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center">
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Camera className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Calibração de Superfície</h2>
            <p className="text-sm text-slate-400">Configure a área de trabalho</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-900/50 rounded-2xl p-6 mb-6 border border-slate-700/50">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Posicione a câmera</p>
                <p className="text-slate-400 text-sm mt-1">
                  Aponte a câmera para uma superfície branca ou clara (mesa, papel, etc.)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Aguarde a detecção</p>
                <p className="text-slate-400 text-sm mt-1">
                  O sistema detectará automaticamente a superfície branca na imagem
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Confirme a calibração</p>
                <p className="text-slate-400 text-sm mt-1">
                  Verifique se a área detectada está correta e confirme
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Status */}
        <div className="mb-6">
          {detectedSurface ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-400 font-medium">Superfície detectada!</p>
                <p className="text-slate-300 text-sm mt-1">
                  Área: {Math.round(detectedSurface.width * 100)}% × {Math.round(detectedSurface.height * 100)}% da imagem
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  A área detectada será usada como sua área de trabalho virtual
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-400 font-medium">Aguardando detecção...</p>
                <p className="text-slate-300 text-sm mt-1">
                  Certifique-se de que a superfície branca está bem visível e iluminada
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!detectedSurface}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmar Calibração
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurfaceCalibrationUI;

