program SnakeGame;

uses
  crt;

const
  MaxLength = 100;
  Width = 20;
  Height = 10;

type
  Position = record
    x, y: integer;
  end;

var
  Snake: array[1..MaxLength] of Position;
  SnakeLength: integer;
  Direction: char;
  Food: Position;
  GameOver: boolean;

procedure InitializeGame;
var
  i: integer;
begin
  clrscr;
  SnakeLength := 5;
  for i := 1 to SnakeLength do
  begin
    Snake[i].x := Width div 2 + i - 1;
    Snake[i].y := Height div 2;
  end;
  Direction := 'L';
  Food.x := random(Width) + 1;
  Food.y := random(Height) + 1;
  GameOver := False;
end;

procedure DrawGame;
var
  i, j: integer;
begin
  clrscr;
  for i := 1 to Height do
  begin
    for j := 1 to Width do
    begin
      if (i = 1) or (i = Height) or (j = 1) or (j = Width) then
        write('#')
      else if (i = Snake[1].y) and (j = Snake[1].x) then
        write('O')
      else if (i = Food.y) and (j = Food.x) then
        write('*')
      else
      begin
        write(' ');
      end;
    end;
    writeln;
  end;
end;

procedure MoveSnake;
var
  i: integer;
  NewHead: Position;
begin
  NewHead := Snake[1];
  case Direction of
    'U': Dec(NewHead.y);
    'D': Inc(NewHead.y);
    'L': Dec(NewHead.x);
    'R': Inc(NewHead.x);
  end;

  for i := SnakeLength downto 2 do
  begin
    Snake[i] := Snake[i - 1];
  end;
  Snake[1] := NewHead;

  if (Snake[1].x = Food.x) and (Snake[1].y = Food.y) then
  begin
    Inc(SnakeLength);
    Food.x := random(Width) + 1;
    Food.y := random(Height) + 1;
  end;
end;

procedure CheckCollision;
begin
  if (Snake[1].x = 1) or (Snake[1].x = Width) or
     (Snake[1].y = 1) or (Snake[1].y = Height) then
    GameOver := True;
end;

procedure UpdateDirection;
begin
  if KeyPressed then
  begin
    case ReadKey of
      'w': if Direction <> 'D' then Direction := 'U';
      's': if Direction <> 'U' then Direction := 'D';
      'a': if Direction <> 'R' then Direction := 'L';
      'd': if Direction <> 'L' then Direction := 'R';
    end;
  end;
end;

begin
  randomize;
  InitializeGame;
  while not GameOver do
  begin
    DrawGame;
    UpdateDirection;
    MoveSnake;
    CheckCollision;
    Delay(200);
  end;
  writeln('Game Over!');
end.
