import {
  Box,
  Grid,
  Button,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  Link,
} from '@mui/material';
import React, { ReactElement, useEffect, useMemo } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { Card, Card as RetroCardType, CardGroup, Column } from '../types';
import Avatar from '../elements/Avatar';
import SendIcon from '@mui/icons-material/Send';
import Color from 'color';
import shortid from 'shortid';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { RetroCard } from './retroCard/RetroCard';
import theme from '../theme/theme';
import { RetroCardGroup } from './RetroCardGroup';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 160px)',
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
  columnId,
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
  columnId: string;
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
    state: { columns, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const groupColour = columns.find(
    column => column.id === columnId
  )?.groupColour;
  const groupFontColour = columns.find(
    column => column.id === columnId
  )?.groupFontColour;
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
      avatar: global.user.avatar,
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

  const createGroup = async (groupId: string) => {
    await saveAndProcessAction(BoardActionType.CREATE_GROUP, {
      groupId,
      columnId,
      order: 0,
    });
  };
  const mergeCards = async (cardId1: string, cardId2: string) => {
    const groupId = shortid.generate();
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await createGroup(groupId);
    await moveCard(cardId1, groupId, 0);
    await moveCard(cardId2, groupId, 1).then(() => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: false },
      });
    });

    // await saveAndProcessAction(BoardActionType.MERGE_CARDS, {
    //   cardId1,
    //   cardId2,
    //   order: column.groups.length,
    //   groupId: shortid.generate(),
    // });
    autoFocusCardId.current = cardId1;
  };

  const submitColumnName = async (value: string) => {
    await saveAndProcessAction(BoardActionType.SET_COLUMN_NAME, {
      columnId: column.id,
      value,
    });
  };

  const publishColumn = async (value: boolean) => {
    // console.log('publish');
    if (true) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      await saveAndProcessAction(BoardActionType.PUBLISH_COLUMN, {
        columnId: column.id,
        value,
      }).then(res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      });
    } else {
      // console.log('already published');
    }
  };

  const submit = async (text: string) => {
    setIslanded(false);

    // console.log(cardGroups);
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await addNewCard(
      (cardGroups.find(cardGroup => cardGroup.name === UNGROUPED) as CardGroup)
        .id,
      text
    ).then((res: any) => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: false },
      });
    });
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
  if (!location.pathname.includes('report')) {
    return (
      <ColumnComponent
        sx={{
          height: noHeightLimit
            ? 'auto'
            : isXsUp
            ? 'calc(var(--app-height) - 165px)'
            : 'calc(var(--app-height) - 150px)',
          borderRadius: '8px',
          border: '1px solid #0B6623',
        }}
        onMouseOver={() => {
          setMouseOver(true);
        }}
        onMouseOut={() => {
          setMouseOver(true);
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: '15px',
              marginBottom: '25px',
              background: groupColour,
              borderRadius: '8px',
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              item
              xs={12}
              md={12}
              lg={12}
            >
              <Grid item lg={8} md={6} xs={6}>
                <div>
                  {!noHeader && (
                    <Typography
                      align="center"
                      sx={{
                        userSelect: 'none',
                        display: 'flex',
                        // fontSize: '0.9rem',
                        color: groupFontColour + '!important',
                        fontSize: '16px',
                        padding: '10px',
                      }}
                    >
                      {true ? (
                        <>{columnName}</>
                      ) : (
                        <>
                          {' '}
                          {leftHeaderComponent}
                          <TextField
                            maxRows={2}
                            disabled={true}
                            sx={{
                              fieldset: { border: 'none' },
                              flex: 10,
                              // padding: '10px',
                              div: { padding: 0, position: 'initial' },
                              textarea: {
                                // textAlign: 'center',
                                color: groupFontColour + '!important',
                                fontSize: '16px',
                                fontWeight: 600,
                              },

                              position: 'initial',
                              display: 'flex',
                              // alignItems: 'center',
                              // justifyContent: 'left',
                            }}
                            multiline
                            fullWidth
                            value={columnName}
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
                        </>
                      )}
                    </Typography>
                  )}
                </div>
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                direction="row"
                item
                lg={4}
                md={5}
                xs={5}
              >
                {global.user.userType == 2 && (!ended || !global.leaveRetro) && (
                  <>
                    {column.publish ? (
                      <Typography style={{ color: '#808080' }}>
                        Published
                      </Typography>
                    ) : (
                      <Typography
                        id={'publish' + columnId}
                        onClick={() => {
                          if (!ended) {
                            publishColumn(true);
                          }
                        }}
                        sx={{
                          color: '#159ADD',
                          textDecorationLline: 'underline',
                          cursor: !ended ? 'pointer' : 'auto',
                        }}
                      >
                        Publish
                      </Typography>
                    )}
                  </>
                )}
                {/* {global.currentRetro?.creatorId === global.user.id && (
                 <img
                   src="/svgs/Unlock.svg"
                   style={{ width: '20px', marginLeft: '15px' }}
                 />
               )} */}
                {global.expandColumn === -1 ? (
                  <img
                    onClick={() => {
                      dispatch({
                        type: ActionType.EXPAND_COLUMN,
                        payload: { expandColumn: +column.id },
                      });
                    }}
                    src="/svgs/Expand.svg"
                    style={{
                      width: '20px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  <img
                    onClick={() => {
                      dispatch({
                        type: ActionType.EXPAND_COLUMN,
                        payload: { expandColumn: -1 },
                      });
                    }}
                    src="/svgs/Shrink.svg"
                    style={{
                      width: '20px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </div>
          {/* </Box> */}
          {useMemo(
            () => (
              <>
                {!column.publish && global.user.userType !== 2 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      width: 'calc(100%-20px)',
                      paddingLeft: '10px',
                      paddingRight: '10px',

                      flexDirection: 'column',
                    }}
                    ref={containerRef}
                    style={{
                      overflowY: noHeightLimit ? 'auto' : 'scroll',
                      userSelect: 'none',
                      flexGrow: 2,
                    }}
                  >
                    <Grid
                      container
                      // rowSpacing={1}
                      columnSpacing={'20px'}
                      direction="row"
                      justifyContent="space-between"
                    >
                      {cardGroups.map((group, i) => (
                        <>
                          {group.cards.map((card: RetroCardType, j: number) => (
                            <>
                              {card.createdBy === global.user.id && (
                                <Grid
                                  item
                                  lg={global?.expandColumn !== -1 ? 2 : 6}
                                  md={global?.expandColumn !== -1 ? 2 : 4}
                                  sx={{ marginBottom: '20px' }}
                                >
                                  {/* <Box sx={{width:"100%"}}> */}
                                  <RetroCard
                                    moveCard={moveCard}
                                    card={card}
                                    groups={cardGroups}
                                    currentGroupId={group.id}
                                    columnId={column.id}
                                    hideButtons={false}
                                    animate={true}
                                  />
                                  {/* </Box> */}
                                </Grid>
                              )}
                            </>
                          ))}
                        </>
                      ))}
                    </Grid>
                    <span
                      ref={surroundDiv}
                      style={{
                        display: 'none',
                      }}
                    ></span>
                  </Box>
                ) : (
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
                        <Grid
                          container
                          lg={12}
                          item
                          key={group.id}
                          ref={e => (groupRefs[i] = e)}
                          style={{
                            marginBottom: '10px',
                            padding: '3px',
                            borderRadius: 0,
                            background:
                              group.name !== UNGROUPED ? groupColour : 'none',
                          }}
                        >
                          <RetroCardGroup
                            admin={global.user.userType == 2}
                            group={group}
                            column={column}
                            columnId={column.id}
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
                                {group.cards.map(
                                  (card: RetroCardType, j: number) =>
                                    (card.createdBy === global.user.id ||
                                      global.user.userType == 2 ||
                                      column.publish) && (
                                      <React.Fragment key={card.id}>
                                        {group.name === UNGROUPED ||
                                        j <
                                          (groupCollapsed[i]
                                            ? 2
                                            : group.cards.length) ? (
                                          <>
                                            <Grid
                                              item
                                              lg={
                                                global?.expandColumn !== -1
                                                  ? 2
                                                  : 6
                                              }
                                              md={
                                                global?.expandColumn !== -1
                                                  ? 2
                                                  : 4
                                              }
                                              ref={e =>
                                                cardRefCollector(
                                                  e as HTMLDivElement,
                                                  i,
                                                  j,
                                                  card
                                                )
                                              }
                                              style={{
                                                padding: '10px',
                                              }}
                                            >
                                              <Draggable
                                                ref={ref => {
                                                  draggableRefs[i][j] = ref;
                                                }}
                                                disabled={
                                                  ended ||
                                                  global.leaveRetro ||
                                                  (card.locked &&
                                                    card.lockedBy !==
                                                      global.user.id)
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
                                                cancel={'.can'}
                                                handle=".handle"
                                              >
                                                <span
                                                  className={
                                                    global.user.userType == 2
                                                      ? 'handle'
                                                      : ''
                                                  }
                                                >
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
                                                ref={ref =>
                                                  (placeholderRefs[i][j] = ref)
                                                }
                                              ></div>
                                            </Grid>
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
                                    )
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                          </RetroCardGroup>
                        </Grid>
                      ))}

                      <span
                        ref={surroundDiv}
                        style={{ display: 'none' }}
                      ></span>
                    </div>
                  </>
                )}
              </>
            ),
            [column.groups, groupCollapsed]
          )}
          {!ended &&
          !global.leaveRetro &&
          ((!isXsUp && mouseOver) || (isXsUp && showEditBox)) ? (
            <Box
              style={{
                background: 'white',
                borderRadius: '0px 0px 8px 8px',
                // margin: '3px',
                borderTop: '1px solid #F0F0F0',
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
  } else {
    return (
      <ColumnComponent
        sx={{
          height: noHeightLimit
            ? 'auto'
            : isXsUp
            ? 'calc(var(--app-height) - 165px)'
            : 'calc(var(--app-height) - 150px)',
        }}
        onMouseOver={() => {
          setMouseOver(true);
        }}
        onMouseOut={() => {
          setMouseOver(true);
        }}
      >
        <Box
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          mr="192px"
          ml="192px"
        >
          {useMemo(
            () => (
              <>
                {!column.publish && global.user.userType !== 2 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      width: 'calc(100%-20px)',
                      paddingLeft: '10px',
                      paddingRight: '10px',

                      flexDirection: 'column',
                    }}
                    ref={containerRef}
                    style={{
                      overflowY: noHeightLimit ? 'auto' : 'scroll',
                      userSelect: 'none',
                      flexGrow: 2,
                    }}
                  >
                    <Grid
                      container
                      // rowSpacing={1}
                      columnSpacing={'20px'}
                      direction="row"
                      justifyContent="space-between"
                    >
                      {cardGroups.map((group, i) => (
                        <>
                          {group.cards.map((card: RetroCardType, j: number) => (
                            <>
                              {card.createdBy === global.user.id && (
                                <Grid
                                  item
                                  lg={3}
                                  md={3}
                                  xs={6}
                                  sx={{ marginBottom: '20px' }}
                                >
                                  {/* <Box sx={{width:"100%"}}> */}
                                  <RetroCard
                                    moveCard={moveCard}
                                    card={card}
                                    groups={cardGroups}
                                    currentGroupId={group.id}
                                    columnId={column.id}
                                    hideButtons={false}
                                    animate={true}
                                  />
                                  {/* </Box> */}
                                </Grid>
                              )}
                            </>
                          ))}
                        </>
                      ))}
                    </Grid>
                    <span
                      ref={surroundDiv}
                      style={{
                        display: 'none',
                      }}
                    ></span>
                  </Box>
                ) : (
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
                        <Grid
                          container
                          item
                          lg={12}
                          key={group.id}
                          ref={e => (groupRefs[i] = e)}
                          style={{
                            marginBottom: '10px',
                            padding: '3px',
                            borderRadius: 0,
                            background:
                              group.name !== UNGROUPED ? groupColour : 'none',
                          }}
                        >
                          <RetroCardGroup
                            admin={global.user.userType == 2}
                            group={group}
                            column={column}
                            columnId={column.id}
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
                                {group.cards.map(
                                  (card: RetroCardType, j: number) =>
                                    (card.createdBy === global.user.id ||
                                      global.user.userType == 2 ||
                                      column.publish) && (
                                      <React.Fragment key={card.id}>
                                        {group.name === UNGROUPED ||
                                        j <
                                          (groupCollapsed[i]
                                            ? 2
                                            : group.cards.length) ? (
                                          <>
                                            <Grid
                                              item
                                              lg={4}
                                              md={4}
                                              xs={6}
                                              ref={e =>
                                                cardRefCollector(
                                                  e as HTMLDivElement,
                                                  i,
                                                  j,
                                                  card
                                                )
                                              }
                                              style={{
                                                padding: '10px',
                                              }}
                                            >
                                              <Draggable
                                                ref={ref => {
                                                  draggableRefs[i][j] = ref;
                                                }}
                                                disabled={
                                                  ended ||
                                                  global.leaveRetro ||
                                                  (card.locked &&
                                                    card.lockedBy !==
                                                      global.user.id)
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
                                                cancel={'.can'}
                                                handle=".handle"
                                              >
                                                <span
                                                  className={
                                                    global.user.userType == 2
                                                      ? 'handle'
                                                      : ''
                                                  }
                                                >
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
                                                ref={ref =>
                                                  (placeholderRefs[i][j] = ref)
                                                }
                                              ></div>
                                            </Grid>
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
                                    )
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                          </RetroCardGroup>
                        </Grid>
                      ))}

                      <span
                        ref={surroundDiv}
                        style={{ display: 'none' }}
                      ></span>
                    </div>
                  </>
                )}
              </>
            ),
            [column.groups, groupCollapsed]
          )}
        </Box>
      </ColumnComponent>
    );
  }
}
