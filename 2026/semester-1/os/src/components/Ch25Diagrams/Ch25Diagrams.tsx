import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch25Diagrams.css';

/**
 * 25장(Files and Directories) 전용 SVG 다이어그램 모음.
 *
 * 다른 장과 같은 규칙을 따른다.
 * - viewBox 기반 → 컨테이너 폭에 맞춰 축소
 * - 색은 theme.css 의 vars.color 토큰만 사용 → 라이트/다크 자동 대응
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. user-readable name vs inode — directory entry
// ════════════════════════════════════════════════════════════════════════════
export function NameVsInode({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 300`} role="img" aria-label="이름과 inode의 분리">
        <ArrowDefs />
        <TitleBox x={40} y={20} w={300} h={48} tone="plain" title="user-readable name" lines={['사용자가 보는 이름 — "bar.txt"']} />
        <TitleBox x={420} y={20} w={300} h={48} tone="accent" title="low-level name = inode number" lines={['커널이 파일을 식별하는 정수 — 67158084']} />
        <Arrow x1={342} y1={44} x2={416} y2={44} label="directory 가 연결" />

        {/* directory file 내부 */}
        <BoxBg x={150} y={108} w={460} h={150} tone="muted" />
        <text x={W / 2} y={130} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          directory file 의 data block — entry 들의 리스트
        </text>
        {[
          ['.', '67158087'],
          ['..', '67158086'],
          ['file1.txt', '67158084'],
          ['foo', '67158085'],
        ].map(([name, ino], i) => (
          <g key={name}>
            <rect x={180} y={142 + i * 26} width={180} height={22} rx={4} fill={vars.color.surface} stroke={vars.color.border} />
            <text x={270} y={157 + i * 26} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
              {`"${name}"`}
            </text>
            <line x1={362} y1={153 + i * 26} x2={416} y2={153 + i * 26} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#arrow-default)" />
            <rect x={420} y={142 + i * 26} width={160} height={22} rx={4} fill={vars.color.accentSoft} stroke={vars.color.accent} />
            <text x={500} y={157 + i * 26} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.accent}>
              inode {ino}
            </text>
          </g>
        ))}
        <Note x={W / 2} y={286} text="directory 도 file 이다 — 단지 <이름, inode 번호> 쌍을 내용으로 갖는 특수한 파일일 뿐" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. 경로 해석 — /foo/bar.txt
// ════════════════════════════════════════════════════════════════════════════
export function PathResolutionWalk({ caption }: { caption?: string }) {
  const W = 760;
  const steps = [
    { title: '/ 디렉터리의 entry 에서 "foo" 검색', sub: '→ foo 의 inode number 획득' },
    { title: 'foo 의 inode 로 디렉터리 내용 읽기', sub: 'foo 도 결국 <이름, inode> 리스트' },
    { title: 'foo 안의 entry 에서 "bar.txt" 검색', sub: '→ bar.txt 의 inode number 획득' },
    { title: 'bar.txt 의 inode 로 데이터 접근', sub: 'metadata 확인 후 data block 위치 파악' },
  ];
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 320`} role="img" aria-label="경로 해석 단계">
        <ArrowDefs />
        <text x={W / 2} y={26} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily={vars.font.mono} fill={vars.color.heading}>
          open(&quot;/foo/bar.txt&quot;) 의 경로 해석
        </text>
        {steps.map((st, i) => (
          <g key={i}>
            <TitleBox x={120} y={44 + i * 66} w={520} h={48} tone={i === 3 ? 'accent' : 'plain'} title={`${i + 1}. ${st.title}`} lines={[st.sub]} />
            {i < 3 && <Arrow x1={W / 2} y1={92 + i * 66} x2={W / 2} y2={108 + i * 66} />}
          </g>
        ))}
        <Note x={W / 2} y={306} text="이름 → inode → (디렉터리면) 또 이름 → inode … 를 경로 끝까지 반복하는 과정" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. fd → struct file → inode → disk 사슬
// ════════════════════════════════════════════════════════════════════════════
export function FdToDiskChain({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 520`} role="img" aria-label="fd에서 디스크까지의 사슬">
        <ArrowDefs />
        <TitleBox x={210} y={14} w={340} h={56} tone="plain" title="User space" lines={['int fd = 3;  read(fd, buf, 4096);']} mono />
        <Arrow x1={W / 2} y1={70} x2={W / 2} y2={92} label="system call" />

        <TitleBox
          x={180}
          y={96}
          w={400}
          h={92}
          tone="accent"
          title="프로세스의 fd table (struct proc 안)"
          lines={['0 → stdin · 1 → stdout · 2 → stderr', '3 → struct file *  ← 가장 작은 빈 칸에 할당', '(프로세스마다 따로)']}
        />
        <Arrow x1={W / 2} y1={188} x2={W / 2} y2={210} />

        <TitleBox
          x={180}
          y={214}
          w={400}
          h={92}
          tone="solution"
          title="Open file table entry (struct file)"
          lines={['ref count · readable/writable', 'offset (현재 위치)', 'inode pointer (struct inode *ip)']}
        />
        <Arrow x1={W / 2} y1={306} x2={W / 2} y2={328} />

        <TitleBox x={180} y={332} w={400} h={70} tone="solution" title="In-memory inode (kernel inode cache)" lines={['metadata 사본 + disk block 정보']} />
        <Arrow x1={W / 2} y1={402} x2={W / 2} y2={424} />

        <TitleBox x={180} y={428} w={400} h={70} tone="muted" title="Disk / Storage" lines={['on-disk inode (metadata) + data blocks (실제 내용)']} />

        <Note x={W / 2} y={516} text="offset 은 open file table entry 에, metadata 는 inode 에 — stat() 이 보는 곳과 read() 가 갱신하는 곳이 다르다" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. offset 독립 — 같은 파일을 두 번 open
// ════════════════════════════════════════════════════════════════════════════
export function OffsetIndependence({ caption }: { caption?: string }) {
  const W = 760;
  const rows: Array<[string, string, string, string]> = [
    ['fd1 = open("file", O_RDONLY);', '3', '0', '-'],
    ['fd2 = open("file", O_RDONLY);', '4', '0', '0'],
    ['read(fd1, buffer1, 100);', '100', '100', '0'],
    ['read(fd2, buffer2, 100);', '100', '100', '100'],
    ['close(fd1);', '0', '-', '100'],
    ['close(fd2);', '0', '-', '-'],
  ];
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 300`} role="img" aria-label="독립적인 offset">
        <ArrowDefs />
        <text x={60} y={32} fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          System Call
        </text>
        <text x={430} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          Return
        </text>
        <text x={540} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          OFT[10] off
        </text>
        <text x={660} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          OFT[11] off
        </text>
        <line x1={40} y1={42} x2={720} y2={42} stroke={vars.color.borderStrong} strokeWidth={1} />
        {rows.map((r, i) => (
          <g key={i}>
            <text x={60} y={66 + i * 30} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
              {r[0]}
            </text>
            <text x={430} y={66 + i * 30} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
              {r[1]}
            </text>
            <text x={540} y={66 + i * 30} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.accent}>
              {r[2]}
            </text>
            <text x={660} y={66 + i * 30} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.solution}>
              {r[3]}
            </text>
          </g>
        ))}
        <Note x={W / 2} y={264} text="같은 파일이라도 open 을 따로 하면 open file table entry 가 따로 생겨 offset 도 독립" />
        <Note x={W / 2} y={286} text="fd1 의 read 가 fd2 의 위치에 아무 영향을 주지 않는다" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. fork / dup — 같은 entry 공유 → offset 공유
// ════════════════════════════════════════════════════════════════════════════
export function ForkDupShare({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 330`} role="img" aria-label="fork와 dup의 open file entry 공유">
        <ArrowDefs />
        {/* fork 쪽 */}
        <text x={200} y={28} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          fork() — 부모/자식이 entry 공유
        </text>
        <TitleBox x={60} y={42} w={130} h={40} tone="plain" title="Parent fd 3" mono small />
        <TitleBox x={210} y={42} w={130} h={40} tone="plain" title="Child fd 3" mono small />
        <TitleBox x={90} y={140} w={220} h={66} tone="solution" title="같은 open file entry" lines={['ref = 2 · offset 공유!']} small />
        <Arrow x1={125} y1={82} x2={170} y2={136} />
        <Arrow x1={275} y1={82} x2={230} y2={136} />
        <TitleBox x={115} y={240} w={170} h={40} tone="accent" title="inode" small />
        <Arrow x1={200} y1={206} x2={200} y2={236} />

        <line x1={390} y1={20} x2={390} y2={290} stroke={vars.color.border} strokeWidth={1} strokeDasharray="4 4" />

        {/* dup 쪽 */}
        <text x={575} y={28} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          dup() — 한 프로세스 안에서 복제
        </text>
        <TitleBox x={440} y={42} w={130} h={40} tone="plain" title="fd 3" mono small />
        <TitleBox x={590} y={42} w={130} h={40} tone="plain" title="fd 4 (dup)" mono small />
        <TitleBox x={465} y={140} w={220} h={66} tone="solution" title="같은 open file entry" lines={['ref = 2 · offset 공유!']} small />
        <Arrow x1={505} y1={82} x2={545} y2={136} />
        <Arrow x1={655} y1={82} x2={605} y2={136} />
        <TitleBox x={490} y={240} w={170} h={40} tone="accent" title="inode" small />
        <Arrow x1={575} y1={206} x2={575} y2={236} />

        <Note x={W / 2} y={316} text="자식이 lseek(fd, 10, SEEK_SET) 하면 부모의 lseek(fd, 0, SEEK_CUR) 도 10 — 같은 entry 의 offset 이므로" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. write 버퍼링과 fsync
// ════════════════════════════════════════════════════════════════════════════
export function WriteBufferFsync({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 320`} role="img" aria-label="write 버퍼링과 fsync">
        <ArrowDefs />
        <TitleBox x={280} y={16} w={200} h={40} tone="plain" title="write(fd, buf, size)" mono small />
        <Arrow x1={W / 2} y1={56} x2={W / 2} y2={80} />
        <TitleBox x={230} y={84} w={300} h={56} tone="limitation" title="메모리 buffer (page cache) 에 기록" lines={['이 시점엔 디스크에 없다 — crash 시 유실 가능']} />

        <Arrow x1={310} y1={140} x2={180} y2={196} label="" />
        <Arrow x1={450} y1={140} x2={580} y2={196} label="" />

        <TitleBox
          x={50}
          y={200}
          w={300}
          h={72}
          tone="muted"
          title="기본 경로 — “나중에 언젠가”"
          lines={['OS 의 flusher 가 한참 뒤에', '모아서 disk 에 반영']}
          small
        />
        <TitleBox
          x={430}
          y={200}
          w={300}
          h={72}
          tone="solution"
          title="fsync(fd) — “지금 당장”"
          lines={['파일 내용 + metadata 를', '디스크에 강제 반영 후 반환']}
          small
        />
        <Note x={W / 2} y={300} text="새 파일이면 디렉터리 entry 도 디스크에 가야 하므로 fsync(dirfd) 가 추가로 필요할 수 있다" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. 안전 저장 패턴 — tmp + fsync + rename
// ════════════════════════════════════════════════════════════════════════════
export function SafeSaveRename({ caption }: { caption?: string }) {
  const W = 760;
  const steps = [
    { t: 'open("foo.txt.tmp", O_WRONLY|O_CREAT|O_TRUNC)', s: '임시 파일 생성 — 원본은 아직 그대로', tone: 'plain' as const },
    { t: 'write(fd, buffer, size)', s: '새 내용을 임시 파일에 기록', tone: 'plain' as const },
    { t: 'fsync(fd)  →  close(fd)', s: '디스크 반영을 보장한 뒤 닫기', tone: 'solution' as const },
    { t: 'rename("foo.txt.tmp", "foo.txt")', s: 'atomic 교체 — 옛 파일이거나 새 파일이거나, 중간 상태 없음', tone: 'accent' as const },
  ];
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 350`} role="img" aria-label="에디터의 안전 저장 패턴">
        <ArrowDefs />
        <text x={W / 2} y={26} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          에디터가 파일을 안전하게 저장하는 패턴
        </text>
        {steps.map((st, i) => (
          <g key={i}>
            <TitleBox x={90} y={44 + i * 70} w={580} h={52} tone={st.tone} title={st.t} mono small lines={[st.s]} />
            {i < 3 && <Arrow x1={W / 2} y1={96 + i * 70} x2={W / 2} y2={112 + i * 70} />}
          </g>
        ))}
        <Note x={W / 2} y={336} text="어느 시점에 crash 가 나도 foo.txt 는 완전한 옛 버전 아니면 완전한 새 버전 — rename 의 atomicity 덕분" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. hard link 와 link count 트레이스
// ════════════════════════════════════════════════════════════════════════════
export function HardLinkCount({ caption }: { caption?: string }) {
  const W = 760;
  const rows: Array<[string, string]> = [
    ['echo hello > file', '1'],
    ['ln file file2', '2'],
    ['ln file2 file3', '3'],
    ['rm file', '2'],
    ['rm file2', '1'],
    ['rm file3', '0 → 해제!'],
  ];
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 330`} role="img" aria-label="hard link와 link count">
        <ArrowDefs />
        {/* 왼쪽: 구조 */}
        <TitleBox x={40} y={30} w={120} h={36} tone="plain" title='"file"' mono small />
        <TitleBox x={40} y={86} w={120} h={36} tone="plain" title='"file2"' mono small />
        <TitleBox x={40} y={142} w={120} h={36} tone="plain" title='"file3"' mono small />
        <TitleBox x={230} y={78} w={150} h={52} tone="accent" title="inode 67158084" lines={['links = 3']} small />
        <Arrow x1={162} y1={48} x2={226} y2={92} />
        <Arrow x1={162} y1={104} x2={226} y2={104} />
        <Arrow x1={162} y1={160} x2={226} y2={116} />
        <TitleBox x={250} y={180} w={110} h={36} tone="muted" title='"hello"' mono small />
        <Arrow x1={305} y1={130} x2={305} y2={176} />
        <Note x={205} y={250} text="이름 셋, inode 하나 — 셋은 완전히" />
        <Note x={205} y={268} text="동등하다 (원본/사본 구분 없음)" />

        <line x1={420} y1={20} x2={420} y2={300} stroke={vars.color.border} strokeWidth={1} strokeDasharray="4 4" />

        {/* 오른쪽: 트레이스 */}
        <text x={455} y={36} fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          명령
        </text>
        <text x={660} y={36} fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          links
        </text>
        {rows.map((r, i) => (
          <g key={i}>
            <text x={455} y={62 + i * 26} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
              {r[0]}
            </text>
            <text x={660} y={62 + i * 26} fontSize={11.5} fontFamily={vars.font.mono} fill={i === 5 ? vars.color.problem : vars.color.accent}>
              {r[1]}
            </text>
          </g>
        ))}
        <Note x={575} y={250} text="rm = unlink — 이름 하나를 끊을 뿐," />
        <Note x={575} y={268} text="count 0 이 되어야 데이터가 사라진다" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. symbolic link 와 dangling reference
// ════════════════════════════════════════════════════════════════════════════
export function SymlinkDangling({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 330`} role="img" aria-label="symbolic link와 dangling reference">
        <ArrowDefs />
        {/* 정상 상태 */}
        <text x={200} y={28} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          ln -s file file2 직후
        </text>
        <TitleBox x={60} y={44} w={130} h={40} tone="plain" title='"file"' mono small />
        <TitleBox x={60} y={128} w={130} h={64} tone="accent" title="inode A" lines={['data: "hello"']} small />
        <Arrow x1={125} y1={84} x2={125} y2={124} />
        <TitleBox x={230} y={44} w={140} h={40} tone="plain" title='"file2" (symlink)' mono small />
        <TitleBox x={230} y={128} w={140} h={64} tone="solution" title="자기 inode B" lines={['내용 = 경로 문자열', '"file" (4 byte)'] } small />
        <Arrow x1={300} y1={84} x2={300} y2={124} />
        <Arrow x1={228} y1={160} x2={196} y2={160} label="" />
        <Note x={200} y={230} text="symlink 는 대상 inode 를 공유하지 않고" />
        <Note x={200} y={248} text="경로 문자열을 내용으로 갖는 별도 파일" />

        <line x1={400} y1={20} x2={400} y2={300} stroke={vars.color.border} strokeWidth={1} strokeDasharray="4 4" />

        {/* dangling */}
        <text x={580} y={28} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
          rm file 이후
        </text>
        <g opacity={0.35}>
          <TitleBox x={440} y={44} w={130} h={40} tone="plain" title='"file"' mono small />
          <TitleBox x={440} y={128} w={130} h={64} tone="accent" title="inode A" lines={['(해제됨)']} small />
        </g>
        <text x={505} y={68} textAnchor="middle" fontSize={16} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.problem}>
          ✕
        </text>
        <TitleBox x={610} y={44} w={140} h={40} tone="plain" title='"file2" (symlink)' mono small />
        <TitleBox x={610} y={128} w={140} h={64} tone="problem" title="여전히 존재" lines={['가리키는 경로 "file" 이', '사라짐 → 접근 실패']} small />
        <Arrow x1={680} y1={84} x2={680} y2={124} />
        <Note x={580} y={230} text="cat file2 → No such file or directory" />
        <Note x={580} y={248} text="= dangling reference" />

        <Note x={W / 2} y={310} text="hard link 와 달리 symlink 는 다른 파일 시스템·디렉터리도 가리킬 수 있지만, 대상이 사라지면 끊어진다" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Primitives (file-scope)
// ════════════════════════════════════════════════════════════════════════════
function Diagram({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className={s.diagram}>
      {children}
      {caption && <div className={s.caption}>{caption}</div>}
    </div>
  );
}

type BoxTone = 'plain' | 'accent' | 'solution' | 'problem' | 'limitation' | 'muted';

function toneBg(tone: BoxTone): string {
  switch (tone) {
    case 'accent':
      return vars.color.accentSoft;
    case 'solution':
      return vars.color.solutionSoft;
    case 'problem':
      return vars.color.problemSoft;
    case 'limitation':
      return vars.color.limitationSoft;
    case 'muted':
      return vars.color.surfaceAlt;
    default:
      return vars.color.surface;
  }
}
function toneStroke(tone: BoxTone): string {
  switch (tone) {
    case 'accent':
      return vars.color.accent;
    case 'solution':
      return vars.color.solution;
    case 'problem':
      return vars.color.problem;
    case 'limitation':
      return vars.color.limitation;
    case 'muted':
      return vars.color.border;
    default:
      return vars.color.borderStrong;
  }
}
function toneTextColor(tone: BoxTone): string {
  switch (tone) {
    case 'accent':
      return vars.color.accent;
    case 'solution':
      return vars.color.solution;
    case 'problem':
      return vars.color.problem;
    case 'limitation':
      return vars.color.limitation;
    case 'muted':
      return vars.color.textMuted;
    default:
      return vars.color.text;
  }
}

function BoxBg({ x, y, w, h, tone }: { x: number; y: number; w: number; h: number; tone: BoxTone }) {
  return <rect x={x} y={y} width={w} height={h} rx={6} ry={6} fill={toneBg(tone)} stroke={toneStroke(tone)} strokeWidth={1.2} />;
}

function TitleBox({
  x,
  y,
  w,
  h,
  tone,
  title,
  lines,
  mono,
  small,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
  title: string;
  lines?: string[];
  mono?: boolean;
  small?: boolean;
}) {
  const body = lines ?? [];
  const titleY = body.length > 0 ? y + 21 : y + h / 2 + 4.5;
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text
        x={x + w / 2}
        y={titleY}
        textAnchor="middle"
        fontSize={small ? 12 : 12.5}
        fontWeight={700}
        fontFamily={mono ? vars.font.mono : vars.font.sans}
        fill={toneTextColor(tone)}
      >
        {title}
      </text>
      {body.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + 38 + i * 16}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Note({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={11.5} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.textMuted}>
      {text}
    </text>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow-default" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.evoArrow} />
      </marker>
    </defs>
  );
}

function Arrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={vars.color.evoArrow} strokeWidth={1.4} markerEnd="url(#arrow-default)" />
      {label && (
        <text x={midX} y={midY - 6} textAnchor="middle" fontSize={10.5} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          {label}
        </text>
      )}
    </g>
  );
}
