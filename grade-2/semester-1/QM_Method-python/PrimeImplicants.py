#######################################################
# 국민대학교 소프트웨어융합대학 소프트웨어학부
# 논리회로설계 1분반
# QM Method Step 1: Finding Prime Implicants
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
                # print(x)
                return x

    return distance


def simplify(minterm_weight):
    ans = []  # 간소화가 끝난 PI들이 들어갈 리스트
    while len(minterm_weight):  # minterm_weight의 길이가 0이 되면, 간소화가 끝났다는 것으로 간주하고 종료
        # 2중 리스트이며, 길이가 1씩 줄어들게 된다.
        new_minterm_weight = [[] for _ in range(len(minterm_weight) - 1)]
        unused_minterm = []  # 사용되지 않는 minterm은 간소화가 완료되었다는 것을 의미하게된다.
        for i in minterm_weight:
            for j in i:
                unused_minterm.append(j)

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
                        except:
                            pass
                        try:
                            # 간소화가 되었다는 것을 의미, 얘를 나중에 지우는 이유는, 없으며 try에 걸려서 pass가 된다. -> 얜 두번째 통과라 이미 지워졌을 수도..
                            unused_minterm.remove(minterm_weight[i][com1])
                        except:
                            pass

                        if distance not in new_minterm_weight[i]:
                            new_minterm_weight[i].append(distance)

        ans += unused_minterm  # 간소화가 완료된 minterm들을 정답에 추가시켜줌
        minterm_weight = new_minterm_weight  # 바뀐 minterm_weight을 적용시켜줌

    return ans


def solution(minterm):
    variable_number = minterm[0]  # 변수의 개수
    minterm_number = minterm[1]  # minterm의 개수
    minterms = minterm[2:]  # minterm만 남기기

    # minterm들을 hamming weight에 따라 분류
    minterm_weight = [[] for _ in range(variable_number + 1)]

    for minterm in minterms:  # minterm들의 형태를 숫자에서 0010과 같은 형태로 변경
        minterm_weight[hamming_weight(minterm)].append(
            str(bin(minterm).lstrip("0b")).zfill(variable_number))

    answer = simplify(minterm_weight)  # 간소화

    answer.sort()

    for i in range(len(answer)):
        answer[i] = answer[i].replace('2', '-', variable_number)
    return answer
