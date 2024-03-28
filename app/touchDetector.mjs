var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}

export function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

export function handleTouchMove(evt, { onMove }) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /* most significant */
    if (xDiff > 0) {
      onMove("left");
    } else {
      onMove("right");
    }
  } else {
    if (yDiff > 0) {
      onMove("up");
    } else {
      onMove("down");
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}
