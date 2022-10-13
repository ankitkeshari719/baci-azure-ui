import {
  Box,
  Button,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { ReactElement, useMemo } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { Card, Card as RetroCardType, CardGroup, Column } from '../types';

import SendIcon from '@mui/icons-material/Send';
import Color from 'color';
import shortid from 'shortid';
import { GlobalContext } from '../contexts/GlobalContext';
import { RetroCard } from './retroCard/RetroCard';
import theme from '../theme/theme';
import { RetroCardGroup } from './RetroCardGroup';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 120px)',
  display: 'flex',
  flexGrow: 1,
  padding: 0,
});

const TextFieldNoBorderWrapper = styled('div')({
  '.MuiInputBase-multiline': {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  alignItems: 'center',
  position: 'initial',
  display: 'flex',
  maxWidth: '135px',
  fieldset: {
    border: 'none',
  },
  input: {
    padding: 0,
  },
});

export function RetroColumn({
  column,
  cardGroups,
  noHeightLimit,
  expandAllGroups,
  noHeader,
  showEditBox,
  setShowEditBox,
  setIslanded,
  leftHeaderComponent,
  rightHeaderComponent,
}: {
  column: Column;
  noHeader: boolean;
  expandAllGroups?: boolean;
  cardGroups: CardGroup[];
  noHeightLimit?: boolean;
  showEditBox: boolean;
  leftHeaderComponent: any;
  rightHeaderComponent: any;
  setIslanded: (islanded: boolean) => void;
  setShowEditBox: (showEditBox: boolean) => void;
}): ReactElement {
  const selectedCard = React.useRef<number[] | null>(null);
  const dragStartTime = React.useRef<number | null>(null);
  const targetLanding = React.useRef<number[] | null>(null);
  const targetGroup = React.useRef<number | null>(null);
  const targetMergeCard = React.useRef<number[] | null>(null);
  const surroundDiv = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [groupCollapsed, setGroupCollapsed] = React.useState<boolean[]>(
    cardGroups.map(() => true)
  );
  const {
    state: { ended },
    commitAction,
  } = React.useContext(BoardContext);

  const [value, setValue] = React.useState('');
  const [valueSet, setValueSet] = React.useState(false);
  const [mouseOver, setMouseOver] = React.useState(true);
  const autoFocusCardId = React.useRef<string | undefined>(undefined);

  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));

  const groupRefs = cardGroups.map(
    cardGroup => null
  ) as (HTMLDivElement | null)[];
  const cardRefs = cardGroups.map(cardGroup =>
    cardGroup.cards.map(() => null)
  ) as (HTMLDivElement | null)[][];
  const draggableRefs = cardGroups.map(cardGroup =>
    cardGroup.cards.map(() => null)
  ) as (Draggable | null)[][];
  const placeholderRefs = cardGroups.map(cardGroup =>
    cardGroup.cards.map(() => null)
  ) as (HTMLDivElement | null)[][];
  const landingZones = cardGroups.map(cardGroup =>
    Array(cardGroup.cards.length + 1)
      .fill(0)
      .map(() => null)
  ) as (HTMLDivElement | null)[][];
  const [global, dispatch] = React.useContext(GlobalContext);

  const [columnName, setColumnName] = React.useState(column.name);

  // React.useEffect(() => {
  //   setColumnName(column.name);
  // }, [column.name]);
  // React.useEffect(() => {
  //   console.log(groupCollapsed);
  // }, [groupCollapsed]);

  const findCardInGroup = (group: CardGroup, id: string) =>
    group.cards.find(card => card.id === id);

  const findCard = (id: string): Card | undefined => {
    for (const group of column.groups) {
      const card = findCardInGroup(group, id);
      if (card) {
        return card;
      }
    }
    return undefined;
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const addNewCard = async (cardGroupId: string, value: string) => {
    const id = shortid.generate();
    // console.log(id, 'id');
    await saveAndProcessAction(BoardActionType.ADD_NEW_CARD, {
      groupId: cardGroupId,
      id,
      value,
    });
    autoFocusCardId.current = id;
  };

  const moveCard = async (cardId: string, toGroup: string, toIndex: number) => {
    await saveAndProcessAction(BoardActionType.MOVE_CARD, {
      cardId,
      groupId: toGroup,
      index: toIndex,
    });
    autoFocusCardId.current = cardId;
  };

  const mergeCards = async (cardId1: string, cardId2: string) => {
    await saveAndProcessAction(BoardActionType.MERGE_CARDS, {
      cardId1,
      cardId2,
      order: column.groups.length,
      groupId: shortid.generate(),
    });
    autoFocusCardId.current = cardId1;
  };

  const submitColumnName = async (value: string) => {
    await saveAndProcessAction(BoardActionType.SET_COLUMN_NAME, {
      columnId: column.id,
      value,
    });
  };

  const submit = async (text: string) => {
    setIslanded(false);

    // console.log(cardGroups);

      await addNewCard(
        (
          cardGroups.find(
            cardGroup => cardGroup.name === UNGROUPED
          ) as CardGroup
        ).id,
        text
      
    );
    setValue('');
    setValueSet(false);
    setShowEditBox(false);
  };

  const handleStart = (
    i: number,
    j: number,
    event: DraggableEvent,
    data: DraggableData
  ): void => {
    // (cardRefs[i][j].current as HTMLDivElement).style.maxHeight = '0';
    // (landingZones[i][j].current as HTMLDivElement).style.display = 'none';
    if (cardRefs && landingZones) {
      const { top, left, width, height } = (
        (cardRefs[i][j] as HTMLDivElement).firstChild as any
      ).getBoundingClientRect();
      const cardElement = cardRefs[i][j] as HTMLDivElement;
      const draggable = draggableRefs[i][j];
      if (draggable) {
        draggable.setState({ x: 0, y: 0 });
      }
      cardElement.style.padding = '0';
      const placeholder = placeholderRefs[i][j];
      const cardElementChild = cardElement.firstChild as HTMLDivElement;
      if (placeholder) {
        placeholder.style.position = cardElementChild.style.position;
        placeholder.style.display = cardElementChild.style.display;
        placeholder.style.width = `${width}px`;
        placeholder.style.height = `${height}px`;
        placeholder.style.margin = '10px 10px';
        placeholder.style.background = 'none';
      }
      cardElementChild.style.position = 'absolute';
      cardElementChild.style.top = `${top + window.pageYOffset}px`;
      cardElementChild.style.left = `${left + window.pageXOffset}px`;
      cardElementChild.style.width = `${width}px`;
      cardElementChild.style.height = `${height}px`;
      if (j !== 0) {
        (landingZones[i][j] as HTMLDivElement).style.display = 'none';
      }
      //handleDrag(i, j, data);
      dragStartTime.current = new Date().getTime();
    }
  };

  const handleDrag = (
    i: number,
    j: number,
    event: DraggableEvent,
    data: DraggableData
  ): void | false => {
    if (cardRefs) {
      const { top, left, height, width } = (
        (cardRefs[i][j] as HTMLDivElement).firstChild as any
      ).getBoundingClientRect();
      const x = left + window.pageXOffset;
      const y = top + window.pageYOffset;
      targetLanding.current = null;
      targetMergeCard.current = null;
      targetGroup.current = null;

      // Scrolling while driving
      let {
        top: t,
        bottom: b,
        height: h,
      } = (containerRef.current as HTMLDivElement).getBoundingClientRect();
      t += +window.pageYOffset;
      if (y < t) {
        containerRef.current?.scrollBy(0, -(t - y));
      } else if (t + h < y + height) {
        containerRef.current?.scrollBy(0, y + height - (t + h));
      }

      let ii = 0;
      for (const groupRef of groupRefs) {
        if (groupRef !== null && ii !== i) {
          let {
            top: t,
            left: l,
            bottom: b,
            right: r,
            width: w,
            height: h,
          } = (groupRef as HTMLDivElement).getBoundingClientRect();
          l += +window.pageXOffset;
          t += +window.pageYOffset;

          if (t < y && y < t + h && l < x && x < l + w) {
            (groupRef as HTMLDivElement).style.border = '3px dotted gray';
            (groupRef as HTMLDivElement).style.borderRadius = '8px';
            (groupRef as HTMLDivElement).style.padding = '0px';
            targetGroup.current = ii;
          } else {
            (groupRef as HTMLDivElement).style.border = 'none';
            (groupRef as HTMLDivElement).style.borderRadius = '0';
            (groupRef as HTMLDivElement).style.padding = '3px';
          }
        }
        ii++;
      }

      ii = 0;
      for (const group of cardRefs) {
        let jj = 0;
        // Only group within same group
        if (ii === i && cardGroups[ii].name === UNGROUPED) {
          for (const cardRef of group) {
            if (cardRef === null) continue;
            let {
              top: t,
              left: l,
              bottom: b,
              right: r,
              width: w,
              height: h,
            } = (cardRef as HTMLDivElement).getBoundingClientRect();
            l += +window.pageXOffset;
            t += +window.pageYOffset;

            if (
              !targetGroup.current &&
              (j !== jj || i !== ii) &&
              t - height / 2 < y &&
              y < t + height / 2 &&
              l - width / 2 < x &&
              x < l + width / 2 &&
              !cardGroups[ii].cards[jj].locked
            ) {
              //                            ((cardRef as HTMLDivElement).firstChild as any).style.background = '#9EA6AC';

              (surroundDiv.current as HTMLDivElement).style.display = 'inline';
              (surroundDiv.current as HTMLDivElement).style.position =
                'absolute';
              (surroundDiv.current as HTMLDivElement).style.border =
                '3px dotted gray';
              (surroundDiv.current as HTMLDivElement).style.borderRadius =
                '8px';
              (surroundDiv.current as HTMLDivElement).style.top = `${Math.min(
                t,
                y
              )}px`;
              (surroundDiv.current as HTMLDivElement).style.left = `${Math.min(
                l,
                x
              )}px`;
              (surroundDiv.current as HTMLDivElement).style.height = `${
                Math.abs(t - y) + h
              }px`;
              (surroundDiv.current as HTMLDivElement).style.width = `${
                Math.abs(l - x) + w
              }px`;
              (surroundDiv.current as HTMLDivElement).style.zIndex = `1000`;

              targetMergeCard.current = [ii, jj];
            } else {
              // ((cardRef as HTMLDivElement).firstChild as any).style.background = 'none';
            }
            jj++;
          }
        }
        ii++;
      }

      if (!targetMergeCard.current) {
        (surroundDiv.current as HTMLDivElement).style.display = 'none';
      }

      selectedCard.current = [i, j];
    }
  };

  const handleStop = (
    i: number,
    j: number,
    event: DraggableEvent,
    data: DraggableData
  ): void | false => {
    selectedCard.current = [i, j];
    if (cardRefs !== undefined) {
      if (selectedCard.current !== null) {
        // for (const group of cardRefs) {
        //     for (const cardRef of group) {
        //         if (cardRef === null) continue;
        //         ((cardRef as HTMLDivElement).firstChild as any).style.background = 'white';
        //     }
        // }

        const selectedCardElement = cardRefs[selectedCard.current[0]][
          selectedCard.current[1]
        ] as HTMLDivElement;
        selectedCardElement.style.padding = '10px';
        if (selectedCardElement.firstChild) {
          (selectedCardElement.firstChild as any).style.position = 'inherit';
          (selectedCardElement.firstChild as any).style.top = `inherit`;
          (selectedCardElement.firstChild as any).style.left = `inherit`;
          (selectedCardElement.firstChild as any).style.width = `inherit`;
          (selectedCardElement.firstChild as any).style.height = `inherit`;
          (selectedCardElement.firstChild as any).style.transform = ``;
        }
        const placeholder = placeholderRefs[selectedCard.current[0]][
          selectedCard.current[1]
        ] as HTMLDivElement;
        if (placeholder) {
          placeholder.style.width = '0';
          placeholder.style.height = '0';
        }

        if (selectedCard.current[1] !== 0) {
          (
            landingZones[selectedCard.current[0]][
              selectedCard.current[1]
            ] as HTMLDivElement
          ).style.display = 'inline';
        }
        if (targetLanding.current !== null) {
          (
            landingZones[targetLanding.current[0]][
              targetLanding.current[1]
            ] as HTMLDivElement
          ).style.background = 'none';
          (
            landingZones[targetLanding.current[0]][
              targetLanding.current[1]
            ] as HTMLDivElement
          ).style.backgroundColor = 'transparent';
          (
            landingZones[targetLanding.current[0]][
              targetLanding.current[1]
            ] as HTMLDivElement
          ).style.padding = '0';
          (
            landingZones[targetLanding.current[0]][
              targetLanding.current[1]
            ] as HTMLDivElement
          ).style.border = 'none';
        }
        if (targetMergeCard.current) {
          (surroundDiv.current as HTMLDivElement).style.display = 'none';
        }
        for (const groupRef of groupRefs) {
          (groupRef as HTMLDivElement).style.border = 'none';
          (groupRef as HTMLDivElement).style.padding = '3px';
          (groupRef as HTMLDivElement).style.borderRadius = '0';
        }

        try {
          if (
            dragStartTime.current &&
            new Date().getTime() - dragStartTime.current > 500
          ) {
            dragStartTime.current = null;
            if (
              selectedCard.current !== null &&
              targetLanding.current !== null
            ) {
              moveCard(
                cardGroups[selectedCard.current[0]].cards[
                  selectedCard.current[1]
                ].id,
                cardGroups[targetLanding.current[0]].id,
                targetLanding.current[1]
              );
            }
            if (targetGroup.current !== null) {
              moveCard(
                cardGroups[selectedCard.current[0]].cards[
                  selectedCard.current[1]
                ].id,
                cardGroups[targetGroup.current].id,
                cardGroups[targetGroup.current].cards.length
              );
            }
            if (
              selectedCard.current !== null &&
              targetMergeCard.current !== null
            ) {
              mergeCards(
                cardGroups[selectedCard.current[0]].cards[
                  selectedCard.current[1]
                ].id,
                cardGroups[targetMergeCard.current[0]].cards[
                  targetMergeCard.current[1]
                ].id
              );
            }
          }
        } finally {
          selectedCard.current = null;
          targetLanding.current = null;
          targetMergeCard.current = null;
        }
      }
    }
  };

  const cardRefCollector = (
    e: HTMLDivElement,
    i: number,
    j: number,
    card: Card
  ) => {
    cardRefs[i][j] = e as HTMLDivElement;
    if (card.id === autoFocusCardId.current && e !== null) {
      e?.focus();
      e?.scrollIntoView(false);
      autoFocusCardId.current = undefined;
    }
  };

  return (
    <ColumnComponent
      sx={{
        height: noHeightLimit
          ? 'auto'
          : isXsUp
          ? 'calc(var(--app-height) - 145px)'
          : 'calc(var(--app-height) - 120px)',
      }}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseOut={() => {
        setMouseOver(true);
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {!noHeader ? (
          <Typography
            align="center"
            sx={{ userSelect: 'none', display: 'flex', fontSize: '0.9rem' }}
          >
            {leftHeaderComponent}
            <TextField
              maxRows={2}
              sx={{
                fieldset: { border: 'none' },
                flex: 10,
                padding: '10px',
                div: { padding: 0, position: 'initial' },
                textarea: { textAlign: 'center' },
                position: 'initial',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              multiline
              fullWidth
              value={columnName.toUpperCase()}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  submitColumnName(columnName);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              onChange={e => setColumnName(e.currentTarget.value)}
              onBlur={() => submitColumnName(columnName)}
              onSubmit={() => submitColumnName(columnName)}
            ></TextField>
            {rightHeaderComponent}
          </Typography>
        ) : null}
        {useMemo(
          () => (
            <>
              <div
                ref={containerRef}
                style={{
                  overflowY: noHeightLimit ? 'auto' : 'scroll',
                  userSelect: 'none',
                  flexGrow: 2,
                }}
              >
                {cardGroups.map((group, i) => (
                  <div
                    key={group.id}
                    ref={e => (groupRefs[i] = e)}
                    style={{
                      marginBottom: '10px',
                      padding: '3px',
                      borderRadius: 0,
                      background:
                        group.name !== UNGROUPED ? 'rgb(220 220 225)' : 'none',
                    }}
                  >
                    <RetroCardGroup
                      group={group}
                      column={column}
                      showCollapse={
                        group.name !== UNGROUPED &&
                        group.cards.length > 1 &&
                        !groupCollapsed[i]
                      }
                      onCollapse={value => {
                        groupCollapsed[i] = !groupCollapsed[i];
                        setGroupCollapsed([...groupCollapsed]);
                      }}
                    >
                      {group.name === UNGROUPED ||
                      !groupCollapsed[i] ||
                      group.cards.length < 2 ||
                      expandAllGroups ? (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            minHeight: '100px',
                          }}
                        >
                          <span
                            ref={e => {
                              landingZones[i][0] = e as HTMLDivElement;
                            }}
                            style={{
                              maxHeight: '0',
                              margin: '0',
                              padding: '0',
                            }}
                          ></span>
                          {group.cards.map((card: RetroCardType, j: number) => (
                            <React.Fragment key={card.id}>
                              {group.name === UNGROUPED ||
                              j <
                                (groupCollapsed[i] ? 2 : group.cards.length) ? (
                                <>
                                  <span
                                    ref={e =>
                                      cardRefCollector(
                                        e as HTMLDivElement,
                                        i,
                                        j,
                                        card
                                      )
                                    }
                                    style={{ padding: '10px' }}
                                  >
                                    <Draggable
                                      ref={ref => {
                                        draggableRefs[i][j] = ref;
                                      }}
                                      disabled={
                                        ended ||
                                        (card.locked &&
                                          card.lockedBy !== global.user.id)
                                      }
                                      onStart={(event, data) =>
                                        handleStart(i, j, event, data)
                                      }
                                      onStop={(event, data) => {
                                        handleStop(i, j, event, data);
                                      }}
                                      onDrag={(event, data) =>
                                        handleDrag(i, j, event, data)
                                      }
                                      enableUserSelectHack={true}
                                      cancel={'just-name'}
                                      handle=".handle"
                                    >
                                      <span className="handle">
                                        <RetroCard
                                          moveCard={moveCard}
                                          card={card}
                                          groups={cardGroups}
                                          currentGroupId={group.id}
                                          columnId={column.id}
                                          hideButtons={false}
                                          animate={true}
                                        />
                                      </span>
                                    </Draggable>
                                    <div
                                      ref={ref => (placeholderRefs[i][j] = ref)}
                                    ></div>
                                  </span>
                                  <span
                                    ref={e => {
                                      landingZones[i][j + 1] =
                                        e as HTMLDivElement;
                                    }}
                                    style={{
                                      maxHeight: '0',
                                      margin: '0',
                                      padding: '0',
                                    }}
                                  ></span>
                                </>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <div
                            style={{
                              padding: '10px',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{ display: 'flex' }}
                              ref={e => {
                                cardRefs[i][0] = e as HTMLDivElement;
                              }}
                              onClick={() => {
                                groupCollapsed[i] = !groupCollapsed[i];
                                setGroupCollapsed([...groupCollapsed]);
                              }}
                              onTouchStart={() => {
                                groupCollapsed[i] = !groupCollapsed[i];
                                setGroupCollapsed([...groupCollapsed]);
                              }}
                            >
                              {group.cards.map((card, j) =>
                                j !== 0 ? (
                                  <div
                                    key={card.id}
                                    style={{
                                      paddingLeft: '2px',
                                      // marginTop: (group.cards.length - j) + 'px',
                                      // marginBottom: ( group.cards.length - j) + 'px',
                                      background: column.cardColour,
                                      border:
                                        '1px solid ' +
                                        Color(column.cardColour).darken(0.1),
                                    }}
                                  ></div>
                                ) : null
                              )}
                              <span
                                className="handel"
                                ref={e =>
                                  cardRefCollector(
                                    e as HTMLDivElement,
                                    i,
                                    0,
                                    group.cards[0]
                                  )
                                }
                              >
                                <RetroCard
                                  moveCard={moveCard}
                                  card={group.cards[0]}
                                  groups={cardGroups}
                                  currentGroupId={group.id}
                                  columnId={column.id}
                                  hideButtons={true}
                                  animate={false}
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </RetroCardGroup>
                  </div>
                ))}
                <span ref={surroundDiv} style={{ display: 'none' }}></span>
              </div>
            </>
          ),
          [column.groups, groupCollapsed]
        )}
        {!ended && ((!isXsUp && mouseOver) || (isXsUp && showEditBox)) ? (
          <Box
            style={{
              background: 'white',
              borderRadius: '3px',
              margin: '3px',
              border: '1px solid #8E8E8E',
              bottom: '0px',
              padding: '10px',
              display: 'flex',
              ...(isXsUp
                ? { position: 'fixed', width: '100vw', height: '8rem' }
                : {}),
            }}
            onMouseOver={() => {
              setMouseOver(true);
            }}
            onMouseOut={() => {
              setMouseOver(true);
            }}
          >
            <TextFieldNoBorderWrapper
              sx={{
                color: '#8E8E8E',
                flexGrow: 10,
                maxWidth: 'unset',
                flexDirection: 'column',
              }}
            >
              <TextField
                fullWidth
                multiline
                inputProps={{
                  maxLength: MAX_CARD_TEXT_LENGTH,
                  style: {
                    padding: 0,
                  },
                }}
                autoFocus
                sx={{
                  padding: 0,
                  input: { padding: 0 },
                  div: { padding: 0, position: 'initial' },
                  position: 'initial',
                  textarea: {
                    fontStyle: valueSet ? 'normal' : 'italic',
                    color: valueSet ? '#000' : '#8D858A',
                  },
                }}
                value={valueSet ? value : 'Share one thought'}
                onChange={event => {
                  setValue(event.target.value);
                }}
                onFocus={event => {
                  setValueSet(true);
                }}
                onBlur={() => {
                  if (!value) {
                    setValueSet(false);
                  }
                }}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    submit(value);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              ></TextField>
              {value && value.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
                <Typography
                  style={{
                    fontSize: '0.75rem',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Characters remaining: {MAX_CARD_TEXT_LENGTH - value.length}
                </Typography>
              ) : null}
            </TextFieldNoBorderWrapper>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
              }}
            >
              <Button
                style={{ position: 'initial' }}
                disabled={!value || value.length === 0}
                onClick={() => submit(value)}
              >
                <SendIcon></SendIcon>
              </Button>
            </div>
          </Box>
        ) : null}
      </div>
    </ColumnComponent>
  );
}
