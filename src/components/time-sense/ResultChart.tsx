import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LineChart, Line, Area, AreaChart, Cell } from 'recharts';
import type { RoundResult } from '../../types';
import MujiIcon from '../common/MujiIcon';

interface ResultChartProps {
  results: RoundResult[];
}

export default function ResultChart({ results }: ResultChartProps) {
  const chartData = results.map((result) => ({
    name: `R${result.round}`,
    라운드: result.round,
    목표시간: result.targetTime / 1000,
    측정시간: result.measuredTime / 1000,
    오차: result.error / 1000,
    절대오차: Math.abs(result.error / 1000),
  }));

  // 통계 계산
  const averageError = results.reduce((sum, r) => sum + r.error, 0) / results.length;
  const averageErrorSeconds = averageError / 1000;
  const averageAbsError = results.reduce((sum, r) => sum + Math.abs(r.error), 0) / results.length;
  const averageAbsErrorSeconds = averageAbsError / 1000;

  // 최고 기록
  const bestResult = results.reduce((best, r) =>
    Math.abs(r.error) < Math.abs(best.error) ? r : best
  );

  // 일관성 (표준편차)
  const variance = results.reduce((sum, r) =>
    sum + Math.pow(r.error - averageError, 2), 0
  ) / results.length;
  const standardDeviation = Math.sqrt(variance) / 1000;

  // 개선도 (첫 라운드 vs 마지막 라운드)
  const firstError = Math.abs(results[0].error);
  const lastError = Math.abs(results[results.length - 1].error);
  const improvement = ((firstError - lastError) / firstError) * 100;

  const tendency = averageError < -500 ? '빠름' : averageError > 500 ? '느림' : '정확';
  const tendencyColor = averageError < -500 ? 'text-blue-600' : averageError > 500 ? 'text-orange-600' : 'text-green-600';
  const consistencyLevel = standardDeviation < 1 ? '매우 일관적' : standardDeviation < 2 ? '일관적' : '불규칙적';
  const consistencyColor = standardDeviation < 1 ? 'text-green-600' : standardDeviation < 2 ? 'text-blue-600' : 'text-orange-600';

  return (
    <div className="space-y-6">
      {/* 주요 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muji-bg p-4 rounded-lg text-center">
          <div className="text-muji-mid text-xs mb-2">평균 오차</div>
          <div className="text-xl font-bold text-muji-dark">
            {averageErrorSeconds >= 0 ? '+' : ''}{averageErrorSeconds.toFixed(2)}초
          </div>
        </div>
        <div className="bg-muji-beige p-4 rounded-lg text-center">
          <div className="text-muji-mid text-xs mb-2">평균 절대 오차</div>
          <div className="text-xl font-bold text-muji-dark">{averageAbsErrorSeconds.toFixed(2)}초</div>
        </div>
        <div className="bg-white border-2 border-muji-dark p-4 rounded-lg text-center">
          <div className="text-muji-mid text-xs mb-2">경향성</div>
          <div className={`text-xl font-bold ${tendencyColor}`}>{tendency}</div>
        </div>
        <div className="bg-muji-bg p-4 rounded-lg text-center">
          <div className="text-muji-mid text-xs mb-2">일관성</div>
          <div className={`text-xl font-bold ${consistencyColor}`}>{consistencyLevel}</div>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-muji-beige">
          <div className="flex items-center gap-2 mb-3">
            <MujiIcon type="check" size={20} className="text-green-600" />
            <h4 className="font-bold text-muji-dark">최고 기록</h4>
          </div>
          <div className="text-sm text-muji-mid">
            <div>라운드 {bestResult.round}</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {Math.abs(bestResult.error / 1000).toFixed(2)}초
            </div>
            <div className="text-xs mt-1">오차</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-muji-beige">
          <div className="flex items-center gap-2 mb-3">
            <MujiIcon type="chart" size={20} className="text-muji-dark" />
            <h4 className="font-bold text-muji-dark">표준편차</h4>
          </div>
          <div className="text-sm text-muji-mid">
            <div className="text-2xl font-bold text-muji-dark mt-1">
              {standardDeviation.toFixed(2)}초
            </div>
            <div className="text-xs mt-1">측정 일관성</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-muji-beige">
          <div className="flex items-center gap-2 mb-3">
            <MujiIcon type="refresh" size={20} className={improvement >= 0 ? 'text-blue-600' : 'text-orange-600'} />
            <h4 className="font-bold text-muji-dark">개선도</h4>
          </div>
          <div className="text-sm text-muji-mid">
            <div className={`text-2xl font-bold ${improvement >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1`}>
              {improvement >= 0 ? '+' : ''}{improvement.toFixed(0)}%
            </div>
            <div className="text-xs mt-1">첫 vs 마지막</div>
          </div>
        </div>
      </div>

      {/* 라운드별 측정 시간 + 목표 라인 */}
      <div className="bg-white p-6 rounded-lg border border-muji-beige">
        <h3 className="text-lg font-bold text-muji-dark mb-4">라운드별 측정 결과</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b6b6b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6b6b6b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e3db" />
            <XAxis dataKey="name" stroke="#6b6b6b" />
            <YAxis stroke="#6b6b6b" label={{ value: '시간 (초)', angle: -90, position: 'insideLeft' }} domain={[0, 15]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f5f3ef',
                border: '1px solid #e8e3db',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <ReferenceLine y={10} stroke="#3a3a3a" strokeWidth={2} strokeDasharray="5 5" label="목표 10초" />
            <Area type="monotone" dataKey="측정시간" stroke="#3a3a3a" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 오차 트렌드 */}
      <div className="bg-white p-6 rounded-lg border border-muji-beige">
        <h3 className="text-lg font-bold text-muji-dark mb-4">오차 트렌드</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e3db" />
            <XAxis dataKey="name" stroke="#6b6b6b" />
            <YAxis stroke="#6b6b6b" label={{ value: '오차 (초)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f5f3ef',
                border: '1px solid #e8e3db',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#3a3a3a" strokeWidth={2} label="정확" />
            <Line type="monotone" dataKey="오차" stroke="#3a3a3a" strokeWidth={3} dot={{ r: 6, fill: '#3a3a3a' }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 절대 오차 비교 */}
      <div className="bg-white p-6 rounded-lg border border-muji-beige">
        <h3 className="text-lg font-bold text-muji-dark mb-4">라운드별 정확도</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e3db" />
            <XAxis dataKey="name" stroke="#6b6b6b" />
            <YAxis stroke="#6b6b6b" label={{ value: '절대 오차 (초)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f5f3ef',
                border: '1px solid #e8e3db',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="절대오차" fill="#6b6b6b" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.절대오차 < 1 ? '#10b981' : entry.절대오차 < 2 ? '#3a3a3a' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4 text-xs text-muji-mid">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>매우 정확 (&lt;1초)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muji-dark"></div>
            <span>정확 (1-2초)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span>개선 필요 (&gt;2초)</span>
          </div>
        </div>
      </div>

      {/* 종합 피드백 */}
      <div className="bg-gradient-to-br from-muji-bg to-muji-beige p-6 rounded-lg border-2 border-muji-dark">
        <h3 className="text-xl font-bold text-muji-dark mb-4 flex items-center gap-2">
          <MujiIcon type="think" size={24} />
          종합 분석 및 피드백
        </h3>
        <div className="space-y-4 text-muji-dark">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <MujiIcon type="clock" size={18} className="text-muji-dark" />
              시간 감각
            </h4>
            {tendency === '빠름' && (
              <p className="text-sm">시간이 실제보다 <span className="font-bold text-blue-600">빠르게</span> 느껴집니다. 평균적으로 {Math.abs(averageErrorSeconds).toFixed(2)}초 빠르게 측정했습니다.</p>
            )}
            {tendency === '느림' && (
              <p className="text-sm">시간이 실제보다 <span className="font-bold text-orange-600">느리게</span> 느껴집니다. 평균적으로 {Math.abs(averageErrorSeconds).toFixed(2)}초 느리게 측정했습니다.</p>
            )}
            {tendency === '정확' && (
              <p className="text-sm">시간 감각이 <span className="font-bold text-green-600">매우 정확</span>합니다! 평균 오차가 {Math.abs(averageErrorSeconds).toFixed(2)}초입니다.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <MujiIcon type="chart" size={18} className="text-muji-dark" />
              일관성
            </h4>
            {consistencyLevel === '매우 일관적' && (
              <p className="text-sm">측정 결과가 <span className="font-bold text-green-600">매우 일관적</span>입니다. 안정적인 시간 감각을 가지고 있습니다.</p>
            )}
            {consistencyLevel === '일관적' && (
              <p className="text-sm">측정 결과가 <span className="font-bold text-blue-600">일관적</span>입니다. 대체로 안정적인 시간 감각을 보입니다.</p>
            )}
            {consistencyLevel === '불규칙적' && (
              <p className="text-sm">측정 결과가 <span className="font-bold text-orange-600">불규칙적</span>입니다. 상황에 따라 시간 감각이 달라질 수 있습니다.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <MujiIcon type="check" size={18} className="text-muji-dark" />
              학습 제안
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muji-mid">
              {tendency === '빠름' && (
                <>
                  <li>과제 시간을 예상보다 <strong>20-30% 더 길게</strong> 잡아보세요</li>
                  <li>타이머를 활용해 실제 소요 시간을 기록하는 습관을 들이세요</li>
                </>
              )}
              {tendency === '느림' && (
                <>
                  <li>과제 중간중간 <strong>시계를 확인</strong>하는 습관을 들이세요</li>
                  <li>10분, 20분 단위로 알람을 설정해보세요</li>
                </>
              )}
              {tendency === '정확' && (
                <>
                  <li>현재의 시간 감각을 유지하세요</li>
                  <li>다양한 시간대(5초, 30초, 1분)로도 연습해보세요</li>
                </>
              )}
              {improvement >= 10 && <li className="text-green-600 font-bold">연습할수록 정확도가 향상되고 있습니다!</li>}
              {improvement < -10 && <li className="text-orange-600">피곤하거나 산만한 상태일 수 있습니다. 집중할 수 있는 환경을 만들어보세요.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
