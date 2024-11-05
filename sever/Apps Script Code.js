function doGet(e) {
    const action = e.parameter.action; // action 파라미터를 가져옵니다.
    
    if (action === 'login') {
        const studentId = e.parameter.studentId; // 학번
        const studentName = e.parameter.studentName; // 이름
        return checkLogin(studentId, studentName); // 로그인 체크 후 결과 반환
    }
    
    // 기본 동작 (로그 기록)
    const sheetId = '1GDWpGeL3Jct35Z3ieGwN1gLWGFRBfKe1tVcjZ7ETBh4'; // 여기에 시트 ID를 입력하세요.
    const sheetName = '시트1'; // 여기에 시트 이름을 입력하세요.

    const now = new Date();
    const date = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const time = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    
    const sequenceNumber = sheet.getLastRow(); // 마지막 행의 수를 가져옵니다.
    
    const rowData = [sequenceNumber, date, time]; // 순번, 날짜, 시간 데이터
    
    // 로깅
    Logger.log('Logging row: ' + JSON.stringify(rowData));
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput('Data logged successfully.');
}

function checkLogin(studentId, studentName) {
    const loginSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("로그인"); // 로그인 시트
    const data = loginSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) { // 첫 번째 행은 헤더이므로 1부터 시작
        if (data[i][0].toString().trim() === studentId.trim() && data[i][1].trim() === studentName.trim()) {
            // 로그인 성공 시 로그 기록 추가
            logLoginAttempt(studentId, studentName, true);
            return ContentService.createTextOutput(JSON.stringify({ isValid: true }))
                                 .setMimeType(ContentService.MimeType.JSON);
        }
    }
    // 로그인 실패 시 로그 기록 추가
    logLoginAttempt(studentId, studentName, false);
    return ContentService.createTextOutput(JSON.stringify({ isValid: false }))
                         .setMimeType(ContentService.MimeType.JSON);
}

function logLoginAttempt(studentId, studentName, isSuccess) {
    const loginSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("로그인"); // 로그인 시트
    const timestamp = new Date();
    
    // 로그인 시트에 로그 기록 추가
    loginSheet.appendRow([timestamp, studentId, studentName, isSuccess ? "성공" : "실패"]); // 로그 기록 추가

    // 시트1에 동일한 값을 추가
    const sheetId = '1GDWpGeL3Jct35Z3ieGwN1gLWGFRBfKe1tVcjZ7ETBh4'; // 시트 ID
    const sheetName = '시트1'; // 시트 이름
    const sheet1 = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    
    const sequenceNumber = sheet1.getLastRow(); // 시트1의 마지막 행 수
    const date = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const time = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'HH:mm:ss');

    // 시트1에 데이터 추가 (순번, 날짜, 시간, 학번 추가)
    sheet1.appendRow([sequenceNumber, date, time, studentId]); // D열에 학번 추가
}
