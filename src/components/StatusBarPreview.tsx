import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { IdentifiableStatusBarWidget, StatusBarWidgetGroups } from '../config'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Stack from 'react-bootstrap/Stack'

type Props = {
    widgetGroups: StatusBarWidgetGroups
    selectedWidget: IdentifiableStatusBarWidget | null 
    onWidgetSelected: (widget: IdentifiableStatusBarWidget) => void
    onWidgetUnselected: (widget: IdentifiableStatusBarWidget) => void
    onWidgetGroupsUpdated: (newWidgetGroups: StatusBarWidgetGroups) => void
    onWidgetDeleted: (widget: IdentifiableStatusBarWidget) => void
}

export default function StatusBarPreview({ widgetGroups, selectedWidget, onWidgetSelected, onWidgetUnselected, onWidgetGroupsUpdated, onWidgetDeleted }: Props): JSX.Element {
    const orderedGroupNames: (keyof StatusBarWidgetGroups)[] = ['left', 'middle', 'right'] 

    const droppables = orderedGroupNames.map((groupName) => {
        const widgetsForThisGroup = widgetGroups[groupName]
        const draggables = widgetsForThisGroup.map((widget, index) => {
            const isSelectedWidget = selectedWidget !== null && widget.id === selectedWidget.id

            const buttonVariant = isSelectedWidget
                ? 'success'
                : 'primary'
        
            const clickCallback = isSelectedWidget
                ? onWidgetUnselected
                : onWidgetSelected
            
            return (<Draggable draggableId={'widget-' + groupName + index} index={index} key={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ display: 'flex', ...provided.draggableProps.style }}>
                        <ButtonGroup>
                            <Button as="a" onClick={(e) => clickCallback(widget)}
                                variant={buttonVariant}>
                                {widget.type}
                            </Button>
                            <Button onClick={(e) => onWidgetDeleted(widget)} variant={buttonVariant}>X</Button>
                        </ButtonGroup>
                    </div>
                )}
            </Draggable>)
        })

        const droppableBackgroundColor = {
            'left': 'pink',
            'middle': 'purple',
            'right': 'blue',
        }

        return (
            <Droppable droppableId={groupName} key={groupName} direction='horizontal'>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                        style={{ display: 'flex', backgroundColor: droppableBackgroundColor[groupName], padding: '1rem' }}>
                        {draggables}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    })
    
    function handleDragEnd(e: DropResult) {
        if (!e.destination) {
            return
        }

        const newWidgetGroups = structuredClone(widgetGroups)

        const sourceGroup = e.source.droppableId
        const destinationGroup = e.destination.droppableId

        const sourceIndex = e.source.index
        const destinationIndex = e.destination.index

        const widgetToMove = newWidgetGroups[sourceGroup][sourceIndex]
        newWidgetGroups[sourceGroup].splice(sourceIndex, 1)
        newWidgetGroups[destinationGroup].splice(destinationIndex, 0, widgetToMove)

        onWidgetGroupsUpdated(newWidgetGroups)
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Stack direction='horizontal' className='align-items-stretch'>
                {droppables}
            </Stack>
        </DragDropContext>
    )
}
