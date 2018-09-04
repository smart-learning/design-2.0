import React, { Component } from 'react';
import {StyleSheet, Text, View,SafeAreaView, ScrollView} from "react-native";
import CommonStyles from "../../../styles/common";

const styles = StyleSheet.create({
	pageTitle: {
		paddingTop: 40,
		paddingBottom: 40,
		fontSize: 28,
		fontWeight: 'bold',
		color: '#000000',
	},
	sectionTitle: {
		paddingTop: 40,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
	},
	contentTitle: {
		paddingTop: 20,
		paddingBottom: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333333',
	},
	sectionList: {
		paddingBottom: 30,
	},
	sectionListItemText: {
		fontSize: 14,
		color: '#333333',
	},
} );

class PolicyPage extends Component {
    render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<ScrollView style={{width: '100%'}}>
				<View style={CommonStyles.contentContainer}>
					<Text style={styles.pageTitle}>개인정보보호정책</Text>

					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>'윌라'는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>'윌라' 는 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>○ 본 방침은부터 2017년 8월 1일부터 시행됩니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>1. 개인정보의 처리 목적 '윌라'는 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.</Text>
						<Text style={styles.sectionListItemText}>가. 홈페이지 회원가입 및 관리</Text>
						<Text style={styles.sectionListItemText}>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만14세 미만 아동 개인정보 수집 시 법정대리인 동의 여부 확인, 각종 고지·통지, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.</Text>
						<Text style={styles.sectionListItemText}>나. 민원사무 처리</Text>
						<Text style={styles.sectionListItemText}>민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등을 목적으로 개인정보를 처리합니다.</Text>
						<Text style={styles.sectionListItemText}>다. 재화 또는 서비스 제공</Text>
						<Text style={styles.sectionListItemText}>서비스 제공, 청구서 발송, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증, 연령인증, 요금결제·정산 등을 목적으로 개인정보를 처리합니다.</Text>
						<Text style={styles.sectionListItemText}>라. 마케팅 및 광고에의 활용</Text>
						<Text style={styles.sectionListItemText}>신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공 , 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>2. 개인정보의 처리 및 보유 기간</Text>
						<Text style={styles.sectionListItemText}>① '윌라'는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.</Text>
						<Text style={styles.sectionListItemText}>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>{`<`}홈페이지 회원가입 및 관리{`>`}</Text>
						<Text style={styles.sectionListItemText}>'윌라'와 관련한 개인정보는 수집.이용에 관한 동의일로부터{`<`}1년{`>`}까지 위 이용목적을 위하여 보유.이용됩니다.</Text>
						<Text style={styles.sectionListItemText}>-보유근거 : 서비스 이용 혼란 및 부정 이용 방지 및 전자상거래 등에서의 소비자보호에 관한 법률</Text>
						<Text style={styles.sectionListItemText}>-관련법령 :</Text>
						<Text style={styles.sectionListItemText}>1)신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</Text>
						<Text style={styles.sectionListItemText}>2) 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</Text>
						<Text style={styles.sectionListItemText}>3) 대금결제 및 재화 등의 공급에 관한 기록 : 5년</Text>
						<Text style={styles.sectionListItemText}>4) 계약 또는 청약철회 등에 관한 기록 : 5년</Text>
						<Text style={styles.sectionListItemText}>5) 표시/광고에 관한 기록 : 6개월</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>3. 개인정보의 제3자 제공에 관한 사항</Text>
						<Text style={styles.sectionListItemText}>① '윌라'는 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</Text>
						<Text style={styles.sectionListItemText}>② '윌라'는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>{`<`}(주)나이스페이먼츠{`>`}</Text>
						<Text style={styles.sectionListItemText}>- 개인정보를 제공받는 자 : (주)나이스페이먼츠</Text>
						<Text style={styles.sectionListItemText}>- 제공받는 자의 개인정보 이용목적 : 개별 콘텐츠 및 멤버십 결제</Text>
						<Text style={styles.sectionListItemText}>- 제공받는 자의 보유,이용기간: 회원탈퇴시 혹은 위탁계약 종료시까지</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>4. 정보주체의 권리,의무 및 그 행사방법 이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</Text>
						<Text style={styles.sectionListItemText}>① 정보주체는 ‘윌라’ 에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</Text>
						<Text style={styles.sectionListItemText}>1. 개인정보 열람요구</Text>
						<Text style={styles.sectionListItemText}>2. 오류 등이 있을 경우 정정 요구</Text>
						<Text style={styles.sectionListItemText}>3. 삭제요구</Text>
						<Text style={styles.sectionListItemText}>4. 처리정지 요구</Text>
						<Text style={styles.sectionListItemText}>② 제1항에 따른 권리 행사는‘윌라’에 대해 개인정보 보호법 시행규칙 별지 제8호 서식에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 {`<`}기관/회사명{`>`} ‘윌라’는 이에 대해 지체 없이 조치하겠습니다.</Text>
						<Text style={styles.sectionListItemText}>③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는‘윌라’는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</Text>
						<Text style={styles.sectionListItemText}>④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>5. 처리하는 개인정보의 항목 작성</Text>
						<Text style={styles.sectionListItemText}>① '윌라'는 다음의 개인정보 항목을 처리하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>{`<`}홈페이지 회원가입 및 관리{`>`}</Text>
							<Text style={styles.sectionListItemText}>	- 필수항목 : 이메일, 이름</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>6. 개인정보의 파기 '윌라'는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.</Text>
						<Text style={styles.sectionListItemText}>-파기절차이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.</Text>
						<Text style={styles.sectionListItemText}>-파기기한이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.</Text>
						<Text style={styles.sectionListItemText}>-파기방법</Text>
						<Text style={styles.sectionListItemText}>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</Text>
						<Text style={styles.sectionListItemText}>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>7. 개인정보의 안전성 확보 조치 '윌라'는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>1) 정기적인 자체 감사 실시</Text>
						<Text style={styles.sectionListItemText}>개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>2) 개인정보 취급 직원의 최소화 및 교육</Text>
						<Text style={styles.sectionListItemText}>개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>3) 내부관리계획의 수립 및 시행</Text>
						<Text style={styles.sectionListItemText}>개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>4) 해킹 등에 대비한 기술적 대책</Text>
						<Text style={styles.sectionListItemText}>'윌라'은 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>5) 개인정보의 암호화</Text>
						<Text style={styles.sectionListItemText}>이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>6) 접속기록의 보관 및 위변조 방지</Text>
						<Text style={styles.sectionListItemText}>개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>7) 개인정보에 대한 접근 제한</Text>
						<Text style={styles.sectionListItemText}>개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>8) 문서보안을 위한 잠금장치 사용</Text>
						<Text style={styles.sectionListItemText}>개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.</Text>
						<Text style={styles.sectionListItemText}>9) 비인가자에 대한 출입 통제</Text>
						<Text style={styles.sectionListItemText}>개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>8. 개인정보 보호책임자 작성</Text>
						<Text style={styles.sectionListItemText}>①‘윌라’ 는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>▶ 개인정보 보호책임자</Text>
						<Text style={styles.sectionListItemText}>성명 :유병혁</Text>
						<Text style={styles.sectionListItemText}>직급 :부장</Text>
						<Text style={styles.sectionListItemText}>연락처 :02-6206-3238</Text>
						<Text style={styles.sectionListItemText}>이메일 : pyunghyuk.yoo@influential.co.kr</Text>
						<Text style={styles.sectionListItemText}>FAX : 02-720-1043</Text>
						<Text style={styles.sectionListItemText}>※ 개인정보 보호 담당부서로 연결됩니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>▶ 개인정보 보호 담당부서</Text>
						<Text style={styles.sectionListItemText}>부서명 :스마트러닝팀</Text>
						<Text style={styles.sectionListItemText}>담당자 :우혁 과장</Text>
						<Text style={styles.sectionListItemText}>연락처 :02-6206-3231</Text>
						<Text style={styles.sectionListItemText}>이메일 : hyuk.woo@influential.co.kr</Text>
						<Text style={styles.sectionListItemText}>FAX : 02-720-1043</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>② 정보주체께서는 ‘윌라’ 의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. ‘윌라’는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>9. 개인정보 열람청구</Text>
						<Text style={styles.sectionListItemText}>아래의 기관은 {`<`}사업자/단체명{`>`} 과는 별개의 기관으로서, ‘윌라’의 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다.</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>▶ 개인정보 침해신고센터 (한국인터넷진흥원 운영)</Text>
						<Text style={styles.sectionListItemText}>- 소관업무 : 개인정보 침해사실 신고, 상담 신청</Text>
						<Text style={styles.sectionListItemText}>- 홈페이지 : privacy.kisa.or.kr</Text>
						<Text style={styles.sectionListItemText}>- 전화 : (국번없이) 118</Text>
						<Text style={styles.sectionListItemText}>- 주소 : (138-950) 서울시 송파구 중대로 135 한국인터넷진흥원 개인정보침해신고센터</Text>
						<Text style={styles.sectionListItemText}>▶ 개인정보 분쟁조정위원회 (한국인터넷진흥원 운영)</Text>
						<Text style={styles.sectionListItemText}>- 소관업무 : 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)</Text>
						<Text style={styles.sectionListItemText}>- 홈페이지 : privacy.kisa.or.kr</Text>
						<Text style={styles.sectionListItemText}>- 전화 : (국번없이) 118</Text>
						<Text style={styles.sectionListItemText}>- 주소 : (138-950) 서울시 송파구 중대로 135 한국인터넷진흥원 개인정보침해신고센터</Text>
						<Text style={styles.sectionListItemText}>▶ 대검찰청 사이버범죄수사단 : 02-3480-3573 (www.spo.go.kr)</Text>
						<Text style={styles.sectionListItemText}>▶ 경찰청 사이버범죄수사단 : 1566-0112 (www.netan.go.kr)</Text>
					</View>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItemText}>10. 개인정보 처리방침 변경</Text>
						<Text style={styles.sectionListItemText}>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
    }
}

    
export default PolicyPage;
