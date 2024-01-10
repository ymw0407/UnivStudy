#######################################################
# 국민대학교 소프트웨어융합대학 소프트웨어학부
# 논리회로설계 1분반
# QM Method Step 2: Finding Essential Prime Implicants
# 20223108 윤민우
#######################################################
def hamming_weight(n):
    try:
        n = str(bin(n))
    except:
        pass
    return n.count("1")


def hamming_distance(x, y):  # 1이면 아니면 false 반환, 1이면 다른 부분의 위치 반환
    distance = 0
    for i in range(len(x)):
        if x[i] == y[i] or (x[i] == "2" and y[i] == "2"):
            continue
        else:
            distance += 1

    if distance == 1:
        for i in range(len(x)):
            if x[i] == y[i] or (x[i] == "2" and y[i] == "2"):
                continue
            else:
                x = x[:i] + "2" + x[i+1:]
                return x

    return distance


def simplify(minterm_weight, chart):
    ans = []  # 간소화가 끝난 PI들이 들어갈 리스트
    ans_chart = []
    while len(minterm_weight):  # minterm_weight의 길이가 0이 되면, 간소화가 끝났다는 것으로 간주하고 종료
        # 2중 리스트이며, 길이가 1씩 줄어들게 된다.
        new_minterm_weight = [[] for _ in range(len(minterm_weight) - 1)]
        new_chart = [[] for _ in range(len(chart) - 1)]

        unused_minterm = []  # 사용되지 않는 minterm은 간소화가 완료되었다는 것을 의미하게된다.
        for i in minterm_weight:
            for j in i:
                unused_minterm.append(j)

        unused_chart = []
        for i in chart:
            for j in i:
                unused_chart.append(j)

        # 간소화 루프 -> 즉 한번 돌았다는 뜻은 간소화가 한차례 되었다는 것을 의미한다.
        for i in range(len(minterm_weight) - 1):
            # 0번과 1번 리스트를 비교한다면 0번 루프를 의미
            for com1 in range(len(minterm_weight[i])):
                # 0번과 1번 리스트를 비교한다면 1번 루프를 의미
                for com2 in range(len(minterm_weight[i+1])):

                    # 해밍거리가 1이라면, 간소화가 가능 -> 00-0과 같은 str 리턴 / 아니면 실제 해밍거리, int를 리턴
                    distance = hamming_distance(
                        minterm_weight[i][com1], minterm_weight[i+1][com2])

                    # 해밍거리가 1이 아니라는 의미 -> 간소화를 못함 그럼 continue
                    if str(type(distance)) == "<class 'int'>":
                        continue
                    else:  # 해밍거리가 1이라는 의미 -> 간소화 진행
                        try:
                            # 간소화가 되었다는 것을 의미, 하지만 얘를 먼저 지우는 이유는, 이번 루프에서 처음 접했기 때문에 무조건 있음
                            unused_minterm.remove(minterm_weight[i+1][com2])
                            unused_chart.remove(chart[i+1][com2])
                        except:
                            pass
                        try:
                            # 간소화가 되었다는 것을 의미, 얘를 나중에 지우는 이유는, 없으며 try에 걸려서 pass가 된다. -> 얜 두번째 통과라 이미 지워졌을 수도..
                            unused_minterm.remove(minterm_weight[i][com1])
                            unused_chart.remove(chart[i][com1])
                        except:
                            pass

                        if distance not in new_minterm_weight[i]:
                            new_minterm_weight[i].append(distance)
                            new_chart[i].append(
                                chart[i+1][com2] + chart[i][com1])

        ans += unused_minterm  # 간소화가 완료된 minterm들을 정답에 추가시켜줌5, 11, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
        ans_chart += unused_chart
        minterm_weight = new_minterm_weight  # 바뀐 minterm_weight을 적용시켜줌
        chart = new_chart

    return (ans, ans_chart)


def solution(minterm):
    variable_number = minterm[0]  # 변수의 개수
    minterm_number = minterm[1]  # minterm의 개수
    minterms = minterm[2:]  # minterm만 남기기

    minterm_chart = {}  # minterm의 사용횟수를 체크하는 minterm_chart
    for minterm in minterms:
        minterm_chart[minterm] = 0

    # minterm들을 hamming weight에 따라 분류
    minterm_weight = [[] for _ in range(variable_number + 1)]

    for minterm in minterms:  # minterm들의 형태를 숫자에서 0010과 같은 형태로 변경
        minterm_weight[hamming_weight(minterm)].append(
            str(bin(minterm).lstrip("0b")).zfill(variable_number))

    chart = [[] for _ in range(variable_number + 1)]  # PI Chart를 만든다.

    for minterm in minterms:
        chart[hamming_weight(minterm)].append([minterm])

    answer = simplify(minterm_weight, chart)  # 간소화

    pi_answer = answer[0]
    pi_chart = answer[1]

    for i in pi_chart:
        for j in i:
            minterm_chart[j] += 1

    essential = [key for key, value in minterm_chart.items() if value == 1]

    epi = []

    for ess in essential:
        for i in range(len(pi_chart)):
            if ess in pi_chart[i]:
                if pi_answer[i] not in epi:
                    epi.append(pi_answer[i])

    pi_answer.sort()
    epi.sort()

    for i in range(len(pi_answer)):
        pi_answer[i] = pi_answer[i].replace('2', '-', pi_answer[i].count("2"))

    for i in range(len(epi)):
        epi[i] = epi[i].replace('2', '-', epi[i].count("2"))

    final_answer = pi_answer + ["EPI"] + epi
    return final_answer
