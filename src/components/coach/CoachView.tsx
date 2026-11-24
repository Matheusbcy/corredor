'use client';

import React, { useState } from 'react';
import { AthleteProfile, PaceZones, Workout } from '@/types';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Flame, 
  ChevronRight, 
  Trophy,
  Activity
} from 'lucide-react';
import { WorkoutBuilderModal } from './WorkoutBuilderModal';
import { AthleteDetailModal } from './AthleteDetailModal';

interface CoachViewProps {
  athletes: AthleteProfile[];
  workouts: Workout[];
  onAddWorkout: (workout: Workout) => void;
  onUpdatePaceZones: (athleteId: string, zones: PaceZones, new5kTime?: string) => void;
}

export function CoachView({
  athletes,
  workouts,
  onAddWorkout,
  onUpdatePaceZones,
}: CoachViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthleteIdForDetail, setSelectedAthleteIdForDetail] = useState<string | null>(null);
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);
  const [prescribeAthleteId, setPrescribeAthleteId] = useState<string | undefined>(undefined);

  const selectedAthleteForDetail = athletes.find((a) => a.id === selectedAthleteIdForDetail) || null;

  const filteredAthletes = athletes.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.targetRace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAthletes = athletes.length;
  const completedWorkouts = workouts.filter((w) => w.status === 'completed').length;
  const painAlerts = workouts.filter((w) => w.log && w.log.painLevel !== 'none').length;

  const handleOpenPrescribeForAthlete = (athleteId: string) => {
    setPrescribeAthleteId(athleteId);
    setIsPrescribeOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6">
      {/* Top Bar com Estatísticas Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Painel do Treinador</span>
          <h1 className="text-2xl font-extrabold text-white">Gestão da Assessoria</h1>
          <p className="text-xs text-slate-400 mt-0.5">Acompanhamento e prescrição de planilhas</p>
        </div>

        <button
          onClick={() => {
            setPrescribeAthleteId(undefined);
            setIsPrescribeOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Prescrever Novo Treino
        </button>
      </div>

      {/* Cards de Métricas do Treinador */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Atletas Ativos</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white">{totalAthletes}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Treinos Prescritos</span>
            <Calendar className="h-4 w-4 text-orange-400" />
          </div>
          <span className="text-2xl font-black text-white">{workouts.length}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Treinos Concluídos</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white">{completedWorkouts}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Alertas de Dor</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-400">{painAlerts}</span>
        </div>
      </div>

      {/* Lista de Atletas */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-400" />
            Alunos Matriculados
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar atleta ou prova..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredAthletes.map((a) => {
            const athleteWorkouts = workouts.filter((w) => w.athleteId === a.id);
            const hasPain = athleteWorkouts.some((w) => w.log && w.log.painLevel !== 'none');

            return (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-orange-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.avatarUrl}
                        alt={a.name}
                        className="h-11 w-11 rounded-xl object-cover ring-2 ring-orange-500/20"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{a.name}</h3>
                        <p className="text-[11px] text-slate-400">{a.phone}</p>
                      </div>
                    </div>
                    {hasPain && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30" title="Relatou dor recente">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-900 p-2.5 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      <span className="truncate">{a.targetRace}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>VDOT: <strong className="text-emerald-400">{a.paceZones.vdot}</strong></span>
                      <span>5k: <strong className="text-white">{a.personalRecords['5k'] || '--:--'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedAthleteIdForDetail(a.id)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all text-center"
                  >
                    Ver Ficha / Zonas
                  </button>
                  <button
                    onClick={() => handleOpenPrescribeForAthlete(a.id)}
                    className="rounded-xl bg-orange-600/80 hover:bg-orange-500 p-2 text-white transition-all active:scale-95"
                    title="Prescrever treino para este atleta"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feed Recente de Treinos Executados */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          Últimos Feedbacks Recebidos dos Alunos
        </h2>

        <div className="space-y-2">
          {workouts
            .filter((w) => w.status === 'completed' && w.log)
            .map((w) => {
              const athlete = athletes.find((a) => a.id === w.athleteId);
              return (
                <div
                  key={w.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={athlete?.avatarUrl}
                      alt={athlete?.name}
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{athlete?.name}</span>
                        <span className="text-[10px] text-slate-500">• {w.scheduledDate}</span>
                      </div>
                      <p className="text-xs text-orange-400 font-medium">{w.title}</p>
                      {w.log?.athleteFeedback && (
                        <p className="text-xs text-slate-300 italic mt-0.5">"{w.log.athleteFeedback}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-xs font-bold text-white block">{w.log?.distanceKm} km</span>
                      <span className="text-[11px] text-slate-400">{w.log?.avgPace}</span>
                    </div>
                    <div className="rounded-xl bg-orange-950/40 border border-orange-500/30 px-2.5 py-1 text-center">
                      <span className="text-[10px] text-orange-400 block font-semibold">Esforço</span>
                      <span className="text-xs font-black text-white">{w.log?.rpeEffort}/10</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modais */}
      {isPrescribeOpen && (
        <WorkoutBuilderModal
          athletes={athletes}
          initialAthleteId={prescribeAthleteId}
          onClose={() => setIsPrescribeOpen(false)}
          onSave={(newW) => {
            onAddWorkout(newW);
            setIsPrescribeOpen(false);
          }}
        />
      )}

      {selectedAthleteForDetail && (
        <AthleteDetailModal
          athlete={selectedAthleteForDetail}
          workouts={workouts}
          onClose={() => setSelectedAthleteIdForDetail(null)}
          onUpdatePaceZones={onUpdatePaceZones}
        />
      )}
    </div>
  );
}
