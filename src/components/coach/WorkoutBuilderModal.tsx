'use client';

import React, { useState } from 'react';
import { AthleteProfile, Workout, WorkoutTemplate, WorkoutType } from '@/types';
import { X, Plus, Sparkles, Check, Dumbbell } from 'lucide-react';
import { MOCK_TEMPLATES } from '@/lib/mockData';

interface WorkoutBuilderModalProps {
  athletes: AthleteProfile[];
  initialAthleteId?: string;
  initialDate?: string;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

export function WorkoutBuilderModal({
  athletes,
  initialAthleteId,
  initialDate,
  onClose,
  onSave,
}: WorkoutBuilderModalProps) {
  const [athleteId, setAthleteId] = useState(initialAthleteId || athletes[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState(initialDate || '2026-11-23');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WorkoutType>('intervalado');
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState('7.0');
  const [warmup, setWarmup] = useState('2 km trote leve em Z1 + educativos de corrida.');
  const [main, setMain] = useState('8x 400m em ritmo Z5 com 1min30s de trote de recuperação.');
  const [cooldown, setCooldown] = useState('1 km trote bem solto.');
  const [coachNotes, setCoachNotes] = useState('');

  const handleApplyTemplate = (tpl: WorkoutTemplate) => {
    setTitle(tpl.title);
    setType(tpl.type);
    setEstimatedDistanceKm(tpl.estimatedDistanceKm.toString());
    setWarmup(tpl.blocks.warmup);
    setMain(tpl.blocks.main);
    setCooldown(tpl.blocks.cooldown);
    if (tpl.defaultNotes) {
      setCoachNotes(tpl.defaultNotes);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: Workout = {
      id: `w-${Date.now()}`,
      athleteId,
      scheduledDate,
      title: title || 'Treino Prescrito',
      type,
      estimatedDistanceKm: parseFloat(estimatedDistanceKm) || 0,
      blocks: {
        warmup,
        main,
        cooldown,
      },
      coachNotes: coachNotes || undefined,
      status: 'pending',
    };
    onSave(newWorkout);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Prescritor de Treinos</span>
            <h3 className="text-lg font-bold text-white">Nova Planilha / Treino</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modelos Prontos para Carregar Rápido */}
        <div className="mt-4 rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Carregar da Biblioteca de Modelos (1 Clique):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="rounded-xl bg-slate-800 hover:bg-orange-500/20 hover:border-orange-500/40 border border-slate-700/60 px-3 py-1.5 text-xs text-slate-200 transition-all active:scale-95 text-left"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Atleta</label>
              <select
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.targetRace})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Data Programada</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Título do Treino</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Intervalado 8x400m em Z5"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Distância Estimada (km)</label>
              <input
                type="number"
                step="0.5"
                value={estimatedDistanceKm}
                onChange={(e) => setEstimatedDistanceKm(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Treino</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { key: 'intervalado', label: 'Tiros / Intervalado' },
                { key: 'rodagem', label: 'Rodagem Aeróbica' },
                { key: 'longao', label: 'Longão' },
                { key: 'tempo_run', label: 'Tempo Run (Limiar)' },
                { key: 'regenerativo', label: 'Regenerativo' },
                { key: 'forca', label: 'Fortalecimento' },
                { key: 'descanso', label: 'Descanso' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setType(t.key as WorkoutType)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    type === t.key
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-semibold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blocos Estruturados */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                1. Aquecimento
              </label>
              <textarea
                rows={2}
                value={warmup}
                onChange={(e) => setWarmup(e.target.value)}
                placeholder="Ex: 2km trote leve em Z1 + educativas..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-orange-400 mb-1">
                2. Treino Principal
              </label>
              <textarea
                rows={3}
                value={main}
                onChange={(e) => setMain(e.target.value)}
                placeholder="Ex: 8x 400m em Z5 com 1min30s de intervalo..."
                className="w-full rounded-xl border border-orange-500/30 bg-slate-950 p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-400 mb-1">
                3. Volta à Calma / Desaquecimento
              </label>
              <textarea
                rows={2}
                value={cooldown}
                onChange={(e) => setCooldown(e.target.value)}
                placeholder="Ex: 1km trote bem solto..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações / Orientações do Treinador
              </label>
              <input
                type="text"
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                placeholder="Ex: Não passe do ritmo no início; hidrate-se a cada 20 min."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-800 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99]"
            >
              <Check className="h-4 w-4" />
              Prescrever Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
