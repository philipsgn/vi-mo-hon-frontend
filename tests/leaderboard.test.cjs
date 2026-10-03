const assert = require('node:assert/strict');
const test = require('node:test');

const {
  formatLeaderboardScore,
  getHonoraryTitle,
  getRankBadgeBg,
  getRankMedal,
} = require('../src/utils/leaderboardUtils.cjs');

test('getRankMedal returns medals for top 3 and number string for others', () => {
  assert.equal(getRankMedal(1), '🥇');
  assert.equal(getRankMedal(2), '🥈');
  assert.equal(getRankMedal(3), '🥉');
  assert.equal(getRankMedal(4), '#4');
  assert.equal(getRankMedal(10), '#10');
});

test('getRankBadgeBg returns distinctive neo-brutalist colors per rank tier', () => {
  assert.equal(getRankBadgeBg(1), 'yellow');
  assert.equal(getRankBadgeBg(2), 'white');
  assert.equal(getRankBadgeBg(3), 'coral');
  assert.equal(getRankBadgeBg(4), 'mint');
});

test('formatLeaderboardScore formats score with locale and unit', () => {
  assert.equal(formatLeaderboardScore(1250, 'Điểm'), '1.250 Điểm');
  assert.equal(formatLeaderboardScore(28, 'Ngày'), '28 Ngày');
  assert.equal(formatLeaderboardScore(0, 'Điểm'), '0 Điểm');
});

test('getHonoraryTitle assigns correct titles for discipline scale', () => {
  assert.equal(getHonoraryTitle(350, 'discipline'), 'Bậc Thầy Kỷ Luật');
  assert.equal(getHonoraryTitle(200, 'discipline'), 'Khắc Tinh Cám Dỗ');
  assert.equal(getHonoraryTitle(100, 'discipline'), 'Chiến Binh Kỷ Luật');
  assert.equal(getHonoraryTitle(30, 'discipline'), 'Tập Sự Kiềm Chế');
});

test('getHonoraryTitle assigns correct titles for streak scale', () => {
  assert.equal(getHonoraryTitle(35, 'streak'), 'Huyền Thoại Kiên Trì');
  assert.equal(getHonoraryTitle(21, 'streak'), 'Bất Khả Chiến Bại');
  assert.equal(getHonoraryTitle(8, 'streak'), 'Chiến Binh 1 Tuần');
  assert.equal(getHonoraryTitle(4, 'streak'), 'Chiến Binh Bền Bỉ');
  assert.equal(getHonoraryTitle(1, 'streak'), 'Người Mới Nhập Môn');
});
