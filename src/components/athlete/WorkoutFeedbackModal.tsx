'use client';

import React, { useState } from 'react';
import { Workout, WorkoutLog } from '@/types';
import { X, CheckCircle2, AlertTriangle, Flame, Clock, Navigation } from 'lucide-react';

interface WorkoutFeedbackModalProps {
  workout: Workout;
  onClose: () => void;
  onSave: (log: WorkoutLog) => void;
}

export function WorkoutFeedbackModal({ workout, onClose, onSave }: WorkoutFeedbackModalProps) {
  const [distanceKm, setDistanceKm] = useState<string>(
    workout.estimatedDistanceKm > 0 ? workout.estimatedDistanceKm.toString() : '5.0'
  );
  const [durationMinutes, setDurationMinutes] = useState<string>('30');
  const [rpeEffort, setRpeEffort] = useState<number>(7);
  const [painLevel, setPainLevel] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [painLocation, setPainLocation] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  // Cálculo automático do Pace
  const dist = parseFloat(distanceKm);
  const dur = parseFloat(durationMinutes);
  let calculatedPace = '--:-- /km';

  if (!isNaN(dist) && dist > 0 && !isNaN(dur) && dur > 0) {
    const totalSeconds = dur * 60;
    const secPerKm = totalSeconds / dist;
    const paceMins = Math.floor(secPerKm / 60);
    const paceSecs = Math.round(secPerKm % 60);
    calculatedPace = `${paceMins}:${paceSecs < 10 ? '0' : ''}${paceSecs} /km`;
  }

  const rpeDescriptions: Record<number, { text: string; color: string }> = {
    1: { text: 'Extremamente Leve (quase repouso)', color: 'bg-emerald-500' },
    2: { text: 'Muito Fácil (conversa contínua)', color: 'bg-emerald-500' },
    3: { text: 'Fácil (confortável)', color: 'bg-teal-500' },
    4: { text: 'Moderado Leve (respiração cadenciada)', color: 'bg-cyan-500' },
    5: { text: 'Moderado (esforço perceptível)', color: 'bg-blue-500' },
    6: { text: 'Moderado Intenso (frases curtas)', color: 'bg-indigo-500' },
    7: { text: 'Forte (foco exigido)', color: 'bg-amber-500' },
    8: { text: 'Muito Forte (limiar/tiros pesados)', color: 'bg-orange-500' },
    9: { text: 'Quase Máximo (respiração ofegante)', color: 'bg-rose-500' },
    10: { text: 'Máximo Exaustivo (sprint final/teste)', color: 'bg-red-600' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      workoutId: workout.id,
      completedAt: new Date().toISOString(),
      distanceKm: dist || 0,
      durationMinutes: dur || 0,
      avgPace: calculatedPace,
      rpeEffort,
      painLevel,
      painLocation: painLevel !== 'none' ? painLocation : undefined,
      athleteFeedback: feedback,
    };
    onSave(newLog);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-0 sm:p-4 backdrop-blur-sm transition-all animate-in fade-in">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Registrar Execução</span>
            <h3 className="text-lg font-bold text-white">{workout.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Distância e Tempo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Navigation className="h-3.5 w-3.5 text-orange-400" /> Distância (km)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="mt-1.5 w-full bg-transparent text-xl font-bold text-white focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> Duração (minutos)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="mt-1.5 w-full bg-transparent text-xl font-bold text-white focus:outline-none"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Ritmo Médio Calculado */}
          <div className="flex items-center justify-between rounded-xl bg-orange-950/30 border border-orange-500/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="text-xs font-medium text-orange-200">Ritmo Médio (Pace)</span>
            </div>
            <span className="text-base font-extrabold text-orange-400">{calculatedPace}</span>
          </div>

          {/* Escala de Percepção de Esforço (Borg RPE 1-10) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Percepção Subjetiva de Esforço (Borg RPE)
              </label>
              <span className="text-xs font-bold text-orange-400">{rpeEffort} / 10</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {rpeDescriptions[rpeEffort]?.text}
            </p>
            <div className="grid grid-cols-10 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = rpeEffort === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRpeEffort(num)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105 ring-2 ring-orange-300'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dores ou desconfortos */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" /> Sentiu dores ou incômodos anormais?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'none', label: 'Nenhuma' },
                { key: 'mild', label: 'Leve' },
                { key: 'moderate', label: 'Moderada' },
                { key: 'severe', label: 'Forte' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPainLevel(item.key as any)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    painLevel === item.key
                      ? item.key === 'none'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {painLevel !== 'none' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={painLocation}
                  onChange={(e) => setPainLocation(e.target.value)}
                  placeholder="Onde sentiu a dor? (Ex: Joelho direito, canela, tendão...)"
                  className="w-full rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-200 placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  required
                />
              </div>
            )}
          </div>

          {/* Comentários ao Treinador */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Feedback / Como você se sentiu hoje?
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ex: Treino fluiu bem, consegui manter 4:15 nos tiros. O vento estava contra na volta..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-800/80 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              Salvar e Concluir Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
