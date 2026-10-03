/**
 * LEADERBOARD UTILITIES
 * Pure JavaScript logic for formatting, ranking medals, and honorary titles.
 * Complies with AGENTS.md Autonomy First principle.
 */

function getRankMedal(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function getRankBadgeBg(rank) {
  if (rank === 1) return 'yellow';
  if (rank === 2) return 'white';
  if (rank === 3) return 'coral';
  return 'mint';
}

function formatLeaderboardScore(score, unit = 'Điểm') {
  const numericScore = Number(score) || 0;
  return `${numericScore.toLocaleString('vi-VN')} ${unit}`;
}

function getHonoraryTitle(score, type = 'discipline') {
  const numericScore = Number(score) || 0;
  if (type === 'discipline') {
    if (numericScore >= 300) return 'Bậc Thầy Kỷ Luật';
    if (numericScore >= 150) return 'Khắc Tinh Cám Dỗ';
    if (numericScore >= 50) return 'Chiến Binh Kỷ Luật';
    return 'Tập Sự Kiềm Chế';
  } else {
    if (numericScore >= 30) return 'Huyền Thoại Kiên Trì';
    if (numericScore >= 14) return 'Bất Khả Chiến Bại';
    if (numericScore >= 7) return 'Chiến Binh 1 Tuần';
    if (numericScore >= 3) return 'Chiến Binh Bền Bỉ';
    return 'Người Mới Nhập Môn';
  }
}

module.exports = {
  formatLeaderboardScore,
  getHonoraryTitle,
  getRankBadgeBg,
  getRankMedal,
};
