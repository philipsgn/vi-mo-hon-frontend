import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoCard, NeoBadge, NeoProgressBar, NeoButton } from '../design-system/components';

/**
 * QuizletFlashcardDeck: Bộ thẻ bài lật mặt 2 chiều tương tác phong cách Quizlet
 */
export function QuizletFlashcardDeck({
  flashcards = [],
  chapterTitle = 'Chương 1',
  onCompleteDeck,
  isCompleted = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flippedMap, setFlippedMap] = useState({});

  if (!flashcards || flashcards.length === 0) {
    return null;
  }

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const progress = (currentIndex + 1) / totalCards;

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped) {
      setFlippedMap((prev) => ({ ...prev, [currentCard.id]: true }));
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const allFlipped = flashcards.every((c) => flippedMap[c.id]);

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.deckHeader}>
        <View style={styles.deckHeaderLeft}>
          <NeoBadge bg="yellow">
            <Text style={styles.badgeText}>🗂️ QUIZLET FLASHCARDS</Text>
          </NeoBadge>
          <Text style={styles.cardCounterText}>
            Thẻ {currentIndex + 1} / {totalCards}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <NeoProgressBar progress={progress} fillColor="mint" height={10} />
        </View>
      </View>

      {/* Main Interactive Flip Card */}
      <TouchableOpacity
        style={[
          styles.flashcard,
          isFlipped ? styles.flashcardBack : styles.flashcardFront,
        ]}
        onPress={handleFlip}
        activeOpacity={0.9}
      >
        <View style={styles.cardTopBar}>
          <NeoBadge bg={isFlipped ? 'lime' : 'coral'}>
            <Text style={styles.badgeText}>
              {isFlipped ? '💡 BÍ KÍP KHẮC CHẾ' : '🎯 THUẬT NGỮ / CÁM DỖ'}
            </Text>
          </NeoBadge>

          <Text style={styles.flipHintText}>
            {isFlipped ? 'Chạm để xem lại mặt trước ↺' : 'Chạm để lật bí kíp ↻'}
          </Text>
        </View>

        {/* Card Body */}
        {!isFlipped ? (
          <View style={styles.frontContent}>
            <View style={styles.iconCircle}>
              <Text style={styles.cardIcon}>{currentCard.icon}</Text>
            </View>
            <Text style={styles.frontTitle}>{currentCard.front}</Text>
            <View style={styles.tapToRevealBox}>
              <Ionicons name="hand-left-outline" size={16} color={neoColors.coral} />
              <Text style={styles.tapToRevealText}>Chạm vào thẻ để lật xem giải pháp</Text>
            </View>
          </View>
        ) : (
          <View style={styles.backContent}>
            <Text style={styles.backDescription}>{currentCard.back}</Text>

            {currentCard.actionTip && (
              <View style={styles.actionTipCard}>
                <Text style={styles.actionTipLabel}>⚡ HÀNH ĐỘNG THỰC TẾ:</Text>
                <Text style={styles.actionTipText}>{currentCard.actionTip}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Navigation Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={currentIndex === 0 ? '#9CA3AF' : neoColors.black} />
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>
            TRƯỚC
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flipBtn}
          onPress={handleFlip}
          activeOpacity={0.8}
        >
          <Ionicons name="swap-horizontal" size={18} color={neoColors.black} />
          <Text style={styles.flipBtnText}>LẬT THẺ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, currentIndex === totalCards - 1 && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={currentIndex === totalCards - 1}
          activeOpacity={0.8}
        >
          <Text style={[styles.navBtnText, currentIndex === totalCards - 1 && styles.navBtnTextDisabled]}>
            TIẾP
          </Text>
          <Ionicons name="arrow-forward" size={18} color={currentIndex === totalCards - 1 ? '#9CA3AF' : neoColors.black} />
        </TouchableOpacity>
      </View>

      {/* Completion Banner */}
      {(allFlipped || isCompleted) && (
        <View style={styles.deckCompletionBox}>
          <View style={styles.deckCompletionTop}>
            <Text style={styles.deckCompletionEmoji}>🎓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.deckCompletionTitle}>Bạn Đã Nắm Vững Bộ Bí Kíp!</Text>
              <Text style={styles.deckCompletionDesc}>
                Khiên Khắc Chế đã sẵn sàng trang bị cho nhân vật trong phòng thi Subway Surfers.
              </Text>
            </View>
          </View>

          {!isCompleted && onCompleteDeck && (
            <NeoButton
              label="🎉 NHẬN CHỨNG NHẬN & KHIÊN BẢO VỆ ⚡"
              bg="mint"
              onPress={onCompleteDeck}
              style={{ marginTop: 8 }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  deckHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '900',
  },
  cardCounterText: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '800',
  },
  progressContainer: {
    flex: 1,
    maxWidth: 120,
  },
  flashcard: {
    minHeight: 220,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: neoColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  flashcardFront: {
    backgroundColor: neoColors.cream,
  },
  flashcardBack: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
  },
  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipHintText: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  frontContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cardIcon: {
    fontSize: 32,
  },
  frontTitle: {
    color: neoColors.black,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tapToRevealBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tapToRevealText: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '700',
  },
  backContent: {
    gap: 12,
    paddingVertical: 8,
  },
  backDescription: {
    color: neoColors.black,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  actionTipCard: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    padding: 10,
    gap: 4,
  },
  actionTipLabel: {
    color: neoColors.coral,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actionTipText: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  navBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  navBtnText: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  navBtnTextDisabled: {
    color: '#9CA3AF',
  },
  flipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: neoColors.yellow,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  flipBtnText: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  deckCompletionBox: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
    borderWidth: 2,
    borderRadius: neoRadii.md,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  deckCompletionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deckCompletionEmoji: {
    fontSize: 28,
  },
  deckCompletionTitle: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '900',
  },
  deckCompletionDesc: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
});
