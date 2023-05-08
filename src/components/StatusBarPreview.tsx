import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { IdentifiableStatusBarWidget, StatusBarWidgetGroups } from '../config'

type Props = {
    widgetGroups: StatusBarWidgetGroups
    selectedWidget: IdentifiableStatusBarWidget | null 
    onWidgetSelected: (widget: IdentifiableStatusBarWidget) => void
    onWidgetUnselected: (widget: IdentifiableStatusBarWidget) => void
    onWidgetGroupsUpdated: (newWidgetGroups: StatusBarWidgetGroups) => void
}


export default function StatusBarPreview({ widgetGroups, selectedWidget, onWidgetSelected, onWidgetUnselected, onWidgetGroupsUpdated }: Props): JSX.Element {
    const orderedGroupNames: (keyof StatusBarWidgetGroups)[] = ['left', 'middle', 'right'] 
    /*
    const widgets = orderedGroupNames.flatMap((groupName) => widgetGroups[groupName])
    
    const widgetButtons = widgets.map((widget, index) => {
        const isSelectedWidget = selectedWidget !== null && widget.id === selectedWidget.id

        const buttonStyle = isSelectedWidget
            ? { backgroundColor: 'green' }
            : {}
        
        const clickCallback = isSelectedWidget
            ? onWidgetUnselected
            : onWidgetSelected

        return (
            <Draggable draggableId={'widget-' + index} index={index}>
                {(provided, snapshot) => (
                    <div
                        onClick={(e) => clickCallback(widget)}
                        style={buttonStyle}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        {widget.type}
                    </div>
                )}
            </Draggable>
        )
    })
    */

    const droppables = orderedGroupNames.map((groupName) => {
        const widgetsForThisGroup = widgetGroups[groupName]
        const draggables = widgetsForThisGroup.map((widget, index) => {
            const isSelectedWidget = selectedWidget !== null && widget.id === selectedWidget.id

            const buttonStyle = isSelectedWidget
                ? { backgroundColor: 'green', padding: '10px' }
                : {}
        
            const clickCallback = isSelectedWidget
                ? onWidgetUnselected
                : onWidgetSelected
            
            return (<Draggable draggableId={'widget-' + groupName + index} index={index} key={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <div onClick={(e) => clickCallback(widget)}
                            style={buttonStyle}>
                            {widget.type}
                        </div>
                    </div>
                )}
            </Draggable>)
        })

        const droppableBackgroundColor = {
            'left': 'pink', // s ata pera
            'middle': 'purple', // s ata pera
            'right': 'blue', // s ata pera
        }

        return (
            <Droppable droppableId={groupName} key={groupName}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                        style={{ backgroundColor: droppableBackgroundColor[groupName], padding: '20px', margin: '10px' }}>
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
            {droppables}
            {/* <Droppable droppableId='droppable-1'>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {widgetButtons}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable> */}
        </DragDropContext>
    )
}
