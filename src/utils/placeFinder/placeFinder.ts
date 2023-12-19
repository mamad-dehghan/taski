type verticalOptions = "top" | "center" | "bottom"
type horizontalOptions = "left" | "center" | "right"

export type positionType = {
    vertical: verticalOptions,
    horizontal: horizontalOptions,
}[]

type marginObjectT = {
    X: number,
    Y: number,
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
}
// type margin
export type marginsT = Record<
    "container" |
    "targetEl"
    , marginObjectT>
export const placeFinder = (
    // out
    targetEl: DOMRect,
    // in
    currentEl: DOMRect,
    container: DOMRect = document.body.getBoundingClientRect(),
    position: positionType = [{vertical: "top", horizontal: "center"}],
    margins: marginsT = {
        container: {
            X: 0,
            Y: 0
        },
        targetEl: {
            X: 0,
            Y: 0
        }
    }
): {
    Y: number,
    X: number
} => {
    // console.log('position',position,"target",targetEl, "container",container)
    const allMargins: Record<"container" |
        "targetEl", Required<marginObjectT>> = {
        container: {
            top: margins.container?.Y,
            bottom: margins.container?.Y,
            left: margins.container.X,
            right: margins.container.X,
            ...margins.container
        },
        targetEl: {
            top: margins.targetEl?.Y,
            bottom: margins.targetEl?.Y,
            left: margins.targetEl.X,
            right: margins.targetEl.X,
            ...margins.targetEl
        }
    }
    const haveTopSpace = () => (targetEl.top - allMargins.targetEl.top) - (container.top + allMargins.container.top) > currentEl.height

    const haveBottomSpace = () => (container.bottom - allMargins.container.bottom) - (targetEl.bottom + allMargins.targetEl.bottom) > currentEl.height

    const haveLeftSpace = () => (targetEl.left - allMargins.targetEl.left) - (container.left + allMargins.container.left) > currentEl.width

    const haveRightSpace = () => (container.right - allMargins.container.right) - (targetEl.right + allMargins.targetEl.right) > currentEl.width

    const getYTop = () => Math.min(
        (targetEl.top - allMargins.targetEl.top) - currentEl.height,
        container.bottom - allMargins.container.bottom - currentEl.height
    )

    const getYBottom = () => Math.max(
        targetEl.bottom + allMargins.targetEl.bottom,
        container.top + allMargins.container.top
    )

    const getXLeft = () => Math.min(
        (targetEl.left - allMargins.targetEl.left) - currentEl.width,
        container.right - allMargins.container.right - currentEl.width
    )

    const getXRight = () => Math.max(
        targetEl.right + allMargins.targetEl.right,
        container.left + allMargins.container.left
    )

    const getXCenter = () => Math.max(
        container.left + allMargins.container.left,
        Math.min(
            (targetEl.left + targetEl.width / 2) - (currentEl.width / 2),
            container.right - currentEl.width - allMargins.container.right
        )
    )

    const getYCenter = () => Math.max(
        container.top + allMargins.container.top,
        Math.min(
            (targetEl.top + targetEl.height / 2) - (currentEl.height / 2),
            container.bottom - allMargins.container.bottom - currentEl.height
        ),
    )
// merge all min and max for X and Y

    for (const positionKey in position) {
        let X = -1
        let Y = -1
        switch (position[positionKey].vertical) {
            case "top":
                if (haveTopSpace())
                    Y = getYTop()
                break
            case "bottom":
                if (haveBottomSpace()) {
                    Y = getYBottom()
                    // console.log(Y)
                }
                break
            case "center":
                // add if and check for availability
                Y = getYCenter()
        }
        switch (position[positionKey].horizontal) {
            case "left":
                if (haveLeftSpace())
                    X = getXLeft()
                break
            case "right":
                if (haveRightSpace())
                    X = getXRight()
                break
            case "center":
                X = getXCenter()
        }
        if (X !== -1 && Y !== -1) {
            // move between switches
            return {X, Y}
        }
    }
    // console.log(Date.now() - time)
    //         console.log(X,Y)
    return {X: -1, Y: -1}
    // add force for first
}
