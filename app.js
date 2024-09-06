let result = document.getElementById('value'); // 계산결과를 화면에 표시
let total = 0 // 계산의 현재 값 저장, 0 = 초기 값
let historyStack = []; // Undo와 Redo를 위한 통합 스택, 각 계산 단계에서 total 값 기록
let count = 0

const undoButton = document.getElementById('undoButton'),
  addButton = document.getElementById('addButton'),
  subButton = document.getElementById('subButton'),
  redoButton = document.getElementById('redoButton'),
  inputValue = document.getElementById('inputbox');

// ===== onload ===== //
function onload() { // 기능 본문 시작
  undoButton.onclick = handleClick;
  addButton.onclick = handleClick;
  subButton.onclick = handleClick;
  redoButton.onclick = handleClick;
}
//array.length()
// ===== handleClick ===== //
function handleClick(event) { // event : 버튼 클릭
  const clickedButtonId = event.target.id; // 클릭된 버튼의 ID를 가져와서 어떤 버튼이 클릭되었는지 확인

  if (clickedButtonId === 'addButton' || clickedButtonId === 'subButton') {
    
    const inputNumber = parseFloat(inputValue.value); //+,- 버튼을 누르면 값을 정수값으로 출력
    if (!isNaN(inputNumber)) {
      // 새 작업이 발생하면 이전 redo 기록을 모두 제거
      //historyStack = historyStack.filter(item => item.action !== 'redo');

      // 현재 상태를 스택에 저장
      historyStack.push({ action: 'calculate', value: total }); //전체에 값에 계산 추가//
      console.log("historyStack",historyStack)
      if (clickedButtonId === 'addButton') {
        total += inputNumber; // 입력 숫자를 더함
      } else if (clickedButtonId === 'subButton') {
        total -= inputNumber; // 입력 숫자를 뺌
      }

      result.innerText = total // 계산된 값 표시
      inputValue.value = ''; // 입력 필드 비우기
    } else {
      inputValue.value = 's'; // 유효하지 않은 숫자가 입력된 경우 필드 비우기
    }
  }

  if (clickedButtonId === 'undoButton') {
    // 마지막 작업을 찾기 (redo가 아닌 것)
    const lastActionIndex = historyStack.map(item => item.action).lastIndexOf('calculate');
    
    if (lastActionIndex !== -1) {
      const lastAction = historyStack[lastActionIndex];
      historyStack.push({ action: 'redo', value: total }); // 현재 상태를 Redo로 저장
      total = lastAction.value; // 이전 상태로 되돌리기
      result.textContent = total;
      // lastAction을 제거하여 중복 undo를 방지
      historyStack.splice(lastActionIndex, 1);
    }
  }

  if (clickedButtonId === 'redoButton') {
    const lastRedoIndex = historyStack.map(item => item.action).lastIndexOf('redo');
    
    if (lastRedoIndex !== -1) {
      const lastRedo = historyStack[lastRedoIndex];
      historyStack.push({ action: 'calculate', value: total }); // 현재 상태를 Undo로 저장
      total = lastRedo.value; // 다음 상태로 되돌리기
      result.textContent = total;
      // lastRedo를 제거하여 중복 redo를 방지
      historyStack.splice(lastRedoIndex, 1);
    }
  }

  updateButtonStates() // 버튼 상태 업데이트
}

// ===== updateButtonStates ===== //
function updateButtonStates() {
  undoButton.disabled = historyStack.map(item => item.action).lastIndexOf('calculate') === -1;
  redoButton.disabled = historyStack.map(item => item.action).lastIndexOf('redo') === -1;
}
//map : 배열의 모든 함수에 대해 함수를 호출하고, 결과를 새로운 배열로 반환//